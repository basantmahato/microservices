export function validateRequiredFields(fields) {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => !req.body?.[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `${missingFields.join(", ")} ${missingFields.length === 1 ? "is" : "are"} required`
      });
    }

    return next();
  };
}
