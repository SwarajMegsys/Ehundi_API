import Signup from "../modals/signup.modal.js"; 
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';


export const userSignup = async (req, res) => {
    const { fullName, email, phoneNumber, password, confirmPassword } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        // Check if the email already exists
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Signup({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
        });

        await newUser.save();
        return res.status(201).json({ success: 'User registered successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await Signup.find({});
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching users' });
    }
};

// Get user by ID
export const getUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await Signup.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching user' });
    }
};

// Update user information
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { fullName, email, phoneNumber, password } = req.body;

    try {
        const updatedData = {};
        if (fullName) updatedData.fullName = fullName;
        if (email) updatedData.email = email;
        if (phoneNumber) updatedData.phoneNumber = phoneNumber;
        if (password) updatedData.password = await bcrypt.hash(password, 10); // Hashing if password is updated

        const user = await Signup.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ success: 'User updated successfully', user });
    } catch (error) {
        return res.status(500).json({ error: 'Error updating user' });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid doctor ID" });
          }
        const result = await Signup.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ success: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting user' });
    }
};