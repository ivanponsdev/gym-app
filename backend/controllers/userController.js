// backend/controllers/userController.js
const User = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// POST /api/users/login -> autenticar un usuario
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Firmar un token y devolverlo junto al usuario (sin contraseña)
        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            usuario: {
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                edad: user.edad,
                sexo: user.sexo,
                objetivo: user.objetivo,
                role: user.role,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
    }
};

// GET /api/users → listar todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ usuarios: users });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// POST /api/users  crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'El correo electrónico ya está en uso' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ 
        message: 'Usuario creado correctamente',
        usuario: {
            _id: savedUser._id,
            nombre: savedUser.nombre,
            email: savedUser.email,
        }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

// PUT /api/users/:id -> actualizar un usuario
const updateUser = async (req, res) => {
    try {
        const { nombre, email, password, edad, sexo, objetivo, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        user.nombre = nombre || user.nombre;
        user.email = email || user.email;
        user.edad = edad || user.edad;
        user.sexo = sexo || user.sexo;
        user.objetivo = objetivo || user.objetivo;
        if (role) user.role = role;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();
        
        // Devolver el usuario completo (sin contraseña) para actualizar el estado en el frontend
        res.json({
            _id: updatedUser._id,
            nombre: updatedUser.nombre,
            email: updatedUser.email,
            edad: updatedUser.edad,
            sexo: updatedUser.sexo,
            objetivo: updatedUser.objetivo,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
};

// DELETE /api/users/:id -> eliminar un usuario (solo admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        await user.deleteOne(); 
        res.json({ message: 'Usuario eliminado correctamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
};

// DELETE /api/users/me -> eliminar cuenta propia
const deleteMyAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        await user.deleteOne(); 
        res.json({ message: 'Cuenta eliminada correctamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar cuenta', error: error.message });
    }
};

// GET /api/users/profile -> obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json({ usuario: user });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
    }
};

// PUT /api/users/profile -> actualizar perfil del usuario autenticado
const updateProfile = async (req, res) => {
    try {
        const { nombre, email, password, edad, sexo, objetivo } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        user.nombre = nombre || user.nombre;
        user.email = email || user.email;
        user.edad = edad !== undefined ? edad : user.edad;
        user.sexo = sexo || user.sexo;
        user.objetivo = objetivo || user.objetivo;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();
        
        res.json({
            mensaje: 'Perfil actualizado correctamente',
            usuario: {
                _id: updatedUser._id,
                nombre: updatedUser.nombre,
                email: updatedUser.email,
                edad: updatedUser.edad,
                sexo: updatedUser.sexo,
                objetivo: updatedUser.objetivo,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
    }
};

module.exports = { loginUser, getUsers, createUser, updateUser, deleteUser, deleteMyAccount, getProfile, updateProfile };