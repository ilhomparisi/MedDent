import Review from '../models/Review.js';

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const { approved_only, is_result } = req.query;
    const query = {};
    
    if (approved_only === 'true') query.is_approved = true;
    if (is_result) query.is_result = is_result === 'true';
    
    const reviews = await Review.find(query).sort({ display_order: 1, created_at: -1 });
    res.json({ data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ data: review });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

// Create review
export const createReview = async (req, res) => {
  try {
    const reviewData = req.body;
    const review = new Review(reviewData);
    await review.save();
    
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updated_at: new Date() };
    
    const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
