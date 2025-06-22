const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Registrar un nuevo usuario --
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        //Verificar si el correo ya está registrado
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'El correo ya está registrado' });

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
            email: savedUser.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

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

//Obtener todos los usuarios (admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

// Obtener un usuario por ID (admin)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

// Actualizar un usuario (admin)
exports.updateUser = async (req, res) => {    
    try {
        const { name, email, password } = req.body;
    
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
        }
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        user.name = name || user.name;
        user.email = email || user.email;

        if (password) {
            user.password = password;
        }

        const updated = await user.save();
        res.json ({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
};

// Eliminar un usuario (admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};