export const verifyOwnership = (req, res, next) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden: You can only modify your own profile' });
  }
  next();
};
