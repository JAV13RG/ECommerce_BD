const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Registrar un nuevo usuario --
exports.registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    
    try {
        //Verificar si el correo ya está registrado
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Crear un nuevo usuario
        const user = new User({
            name,
            email,
            password //Hash the password in a real application
        });

        const savedUser = await user.save();

        res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin
        });
    } catch (error){
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password} = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });
        } else {
            res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};