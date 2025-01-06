import express from 'express';
import { createListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import Listing from '../models/listing.model.js'; // Add this import

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

router.get('/user/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  try {
    const listings = await Listing.find({ userRef: userId });
    
    if (!listings || listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No listings found for this user'
      });
    }

    res.status(200).json(listings);
  } catch (error) {
    console.error('Server error in /user/:id route:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings',
      error: error.message
    });
  }
});

export default router;