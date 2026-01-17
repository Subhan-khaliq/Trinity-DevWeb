import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

export const getProfile = async (req, res) => {
  try {
    console.log(`🔍 Fetching profile for user ID: ${req.user.id}`);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.error(`❌ User not found in DB: ${req.user.id}`);
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(`❌ Error in getProfile: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, billingAddress } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (billingAddress) user.billingAddress = billingAddress;
    if (password) user.password = password; // Pre-save hook will hash this

    await user.save();

    // Return user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
