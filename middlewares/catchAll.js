const catchAll = (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    return res.json({ message: "404 Not Found" });
  } else if (req.accepts("html")) {
    return res.send("404 Not Found");
  } else {
    return res.type("txt").send("404 Not Found");
  }
};

module.exports = catchAll;
