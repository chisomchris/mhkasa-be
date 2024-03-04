const getEmployees = async (req, res) => {
  const employees = [
    { name: "chisom", age: 23 },
    { name: "Ayomide", age: 24 },
    { name: "Christian", age: 25 },
    { name: "Kaima", age: 26 },
    { name: "Amara", age: 27 },
  ];
  // register new user
  try {
    return res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmployees };
