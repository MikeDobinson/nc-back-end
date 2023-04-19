exports.handleCustomErrors = (err, req, res, next) => {
  const { status, msg } = err;
  console.log(status, msg);
  if (status && msg) {
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};
