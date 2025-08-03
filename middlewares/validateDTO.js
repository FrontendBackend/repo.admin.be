function validateDto(dtoClass) {
  return (req, res, next) => {
    const dto = new dtoClass(req.body);
    const errors = dto.validate();
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    req.dto = dto; // se puede usar en controlador
    next();
  };
}

module.exports = { validateDto };
