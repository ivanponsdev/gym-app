// Espera a que se cargue todo el HTML antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

    // Muestra notificaciones (mensajes temporales) en la esquina de la pantalla
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Muestra una ventana modal para confirmar acciones peligrosas (como borrar cuenta)
    function showConfirmation(message, onConfirm, color = '#ff6600') {
        const modal = document.getElementById('confirmation-modal');
        const messageEl = document.getElementById('confirmation-message');
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');
        const modalContent = modal.querySelector('.modal-content');
        
        messageEl.textContent = message;
        
        // Aplica los colores personalizados al modal
        modalContent.style.borderColor = color;
        modalContent.style.boxShadow = `0 0 30px ${color}40`;
        yesBtn.style.backgroundColor = `${color}20`;
        yesBtn.style.borderColor = color;
        yesBtn.style.color = color;
        yesBtn.style.boxShadow = `0 0 15px ${color}40`;
        
        modal.classList.remove('hidden');
        
        const handleYes = async () => {
            modal.classList.add('hidden');
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            modal.removeEventListener('click', handleOutsideClick);
            if (onConfirm) await onConfirm();
        };
        
        const handleNo = () => {
            modal.classList.add('hidden');
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            modal.removeEventListener('click', handleOutsideClick);
        };
        
        const handleOutsideClick = (e) => {
            if (e.target === modal) handleNo();
        };
        
        yesBtn.addEventListener('click', handleYes);
        noBtn.addEventListener('click', handleNo);
        modal.addEventListener('click', handleOutsideClick);
    }

    // Guarda todas las referencias a elementos del HTML
    // Contenedores principales de cada pantalla
    const landingContainer = document.getElementById('landing-container');
    const infoContainer = document.getElementById('info-container');
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const adminContainer = document.getElementById('admin-container');

    // Botones de la página de bienvenida
    const enterAppBtn = document.getElementById('enter-app-btn');
    const showInfoBtn = document.getElementById('show-info-btn');
    const backToLandingBtn = document.getElementById('back-to-landing-btn');

    // Formularios de login y registro
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    // Elementos del panel de usuario normal
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('#app-container .content-section');
    const logoutBtn = document.getElementById('logout-btn');

    // Elementos del perfil del usuario
    const profileDisplay = document.getElementById('profile-display');
    const profileEditForm = document.getElementById('profile-edit-form');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const cancelEditProfileBtn = document.getElementById('cancel-edit-profile-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    const displayAge = document.getElementById('display-age');
    const displayGender = document.getElementById('display-gender');
    const displayObjective = document.getElementById('display-objective');
    const profileNameInput = document.getElementById('profile-name');
    const profileAgeInput = document.getElementById('profile-age');
    const profileGenderInput = document.getElementById('profile-gender');
    const profileObjectiveInput = document.getElementById('profile-objective');
    const profileNewPasswordInput = document.getElementById('profile-new-password');

    // Elementos del panel de administrador
    const adminNavLinks = document.querySelectorAll('.admin-nav-link');
    const adminContentSections = document.querySelectorAll('#admin-container .content-section');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    
    // Elementos para gestionar usuarios (solo admin)
    const usersTableBody = document.getElementById('users-table-body');
    const addUserBtn = document.getElementById('add-user-btn');
    const userFormContainer = document.getElementById('user-form-container');
    const userForm = document.getElementById('user-form');
    const userFormTitle = document.getElementById('user-form-title');
    const cancelUserFormBtn = document.getElementById('cancel-user-form-btn');
    const usersListContainer = document.getElementById('users-list-container');

    // Botón global para salir
    const exitAppBtn = document.getElementById('exit-app-btn');
    
    // Variables globales para guardar datos de la sesión
    let currentUser = null; // Usuario que ha iniciado sesión
    let allUsers = []; // Lista de todos los usuarios (solo para admin)
    let token = null; // Token JWT para autenticar las peticiones

    // Traduce códigos internos a texto legible
    const genderMap = {
        male: 'Masculino',
        female: 'Femenino',
        other: 'Otro'
    };
    const objectiveMap = {
        aumento_masa: 'Aumento de masa muscular',
        perdida_grasa: 'Pérdida de grasa',
        bienestar_general: 'Bienestar general'
    };

    // Funciones para comunicarse con el backend 
    const api = {
        // Inicia sesión con email y contraseña
        login: async (email, password) => {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error de autenticación');
            }
            return res.json();
        },
        // Registra un nuevo usuario
        register: async (nombre, email, password) => {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al registrar');
            }
            return res.json();
        },
        // Obtiene la lista de todos los usuarios (solo admin)
        getUsers: async () => {
            const res = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Error al cargar usuarios');
            return res.json();
        },
        // Crea un nuevo usuario (solo admin)
        createUser: async (userData) => {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al crear usuario');
            }
            return res.json();
        },
        // Actualiza los datos de un usuario
        updateUser: async (id, userData) => {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al actualizar usuario');
            }
            return res.json();
        },
        // Elimina un usuario (solo admin)
        deleteUser: async (id) => {
            const res = await fetch(`/api/users/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al eliminar usuario');
            }
            return res.json();
        },
        // Elimina tu propia cuenta
        deleteMyAccount: async () => {
            const res = await fetch('/api/users/me', { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al eliminar cuenta');
            }
            return res.json();
        }
    };

    // Cambia qué pantalla se muestra y cuál se oculta
    function showView(viewToShow) {
        const allViews = [landingContainer, infoContainer, authContainer, appContainer, adminContainer];
        allViews.forEach(view => view.classList.add('hidden'));

        if (viewToShow) {
            viewToShow.classList.remove('hidden');
            if ([authContainer, appContainer, adminContainer].includes(viewToShow)) {
                exitAppBtn.classList.remove('hidden');
            } else {
                exitAppBtn.classList.add('hidden');
            }
        }
    }

    // Eventos de los botones de navegación - Navegación de la página home
    enterAppBtn.addEventListener('click', () => showView(authContainer));
    showInfoBtn.addEventListener('click', () => showView(infoContainer));
    backToLandingBtn.addEventListener('click', () => showView(landingContainer));

    // Cambiar entre formulario de login y registro
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Procesa el login cuando el usuario envía el formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await api.login(email, password);
            token = response.token;
            const userData = response.usuario || response;

            currentUser = userData;

            // Comprueba si el usuario es administrador o user
            if (userData.role === 'admin') {
                showView(adminContainer);
                setActiveAdminLink(document.querySelector('.admin-nav-link[data-target="admin-users"]'));
                showNotification(`¡Bienvenido Admin ${currentUser.nombre}!`, 'success');
                await loadAdminData();
            } else {
                showView(appContainer);
                populateUserProfile(currentUser);
                setActiveLink(document.querySelector('.nav-link[data-target="profile"]'));
                showNotification(`¡Bienvenido ${currentUser.nombre}!`, 'success');
            }
        } catch (error) {
            console.error('Error de login:', error);
            showNotification(error.message, 'error');
        }
    });

    // Procesa el registro de nuevos usuarios
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            await api.register(nombre, email, password);
            showNotification('Usuario registrado correctamente. Ahora puedes iniciar sesión.', 'success');
            registerForm.reset();
            showLoginLink.click();
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            showNotification(error.message, 'error');
        }
    });

    // Navegación entre secciones del panel de usuario
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveLink(link);
        });
    });

    // Botón para activar el modo edición del perfil
    editProfileBtn.addEventListener('click', () => {
        profileNameInput.value = currentUser.nombre || '';
        profileAgeInput.value = currentUser.edad || '';
        profileGenderInput.value = currentUser.sexo || 'male';
        profileObjectiveInput.value = currentUser.objetivo || 'bienestar_general';
        profileDisplay.classList.add('hidden');
        profileEditForm.classList.remove('hidden');
    });

    cancelEditProfileBtn.addEventListener('click', () => {
        profileEditForm.classList.add('hidden');
        profileDisplay.classList.remove('hidden');
    });

    // Guarda los cambios del perfil cuando se envía el formulario
    profileEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
            nombre: profileNameInput.value,
            edad: parseInt(profileAgeInput.value),
            sexo: profileGenderInput.value,
            objetivo: profileObjectiveInput.value
        };
        
        if (profileNewPasswordInput.value) {
            updatedData.password = profileNewPasswordInput.value;
        }

        try {
            const updatedUser = await api.updateUser(currentUser._id, updatedData);
            currentUser = updatedUser;
            populateUserProfile(currentUser);
            profileEditForm.classList.add('hidden');
            profileDisplay.classList.remove('hidden');
            profileNewPasswordInput.value = '';
            showNotification('Perfil actualizado correctamente', 'success');
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            showNotification(error.message, 'error');
        }
    });

    // Botón para eliminar la cuenta del usuario actual
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            showConfirmation(
                '¿Estás seguro de que quieres eliminar tu cuenta permanentemente?\n\nEsta acción NO se puede deshacer.',
                async () => {
                    try {
                        await api.deleteMyAccount();
                        showNotification('Cuenta eliminada correctamente', 'info');
                        setTimeout(() => {
                            resetAndExit();
                        }, 2000);
                    } catch (error) {
                        console.error('Error al eliminar cuenta:', error);
                        showNotification(error.message, 'error');
                    }
                },
                '#ff0044'
            );
        });
    }

    // Navegación entre secciones del panel de administrador
    adminNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveAdminLink(link);
        });
    });

    // Carga la lista de usuarios desde el servidor (solo admin)
    async function loadAdminData() {
        try {
            allUsers = await api.getUsers();
            renderUsersTable(allUsers);
        } catch (error) {
            console.error('Error al cargar datos de administrador:', error);
            showNotification('Error al cargar usuarios', 'error');
        }
    }

    addUserBtn.addEventListener('click', () => {
        userForm.reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-password').placeholder = "Contraseña";
        userFormTitle.textContent = 'Añadir Usuario';
        usersListContainer.classList.add('hidden');
        userFormContainer.classList.remove('hidden');
    });

    // Botón para cancelar la creación/edición de usuario
    cancelUserFormBtn.addEventListener('click', () => {
        userFormContainer.classList.add('hidden');
        usersListContainer.classList.remove('hidden');
    });

    // Guarda el usuario nuevo o editado
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const userData = { nombre, email };
        if (password) userData.password = password;

        const userIdToUpdate = document.getElementById('user-id').value;

        try {
            if (userIdToUpdate) {
                await api.updateUser(userIdToUpdate, userData);
                showNotification('Usuario actualizado correctamente', 'success');
            } else {
                await api.createUser(userData);
                showNotification('Usuario creado correctamente', 'success');
            }
            await loadAdminData();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            showNotification(error.message, 'error');
        }
        
        userFormContainer.classList.add('hidden');
        usersListContainer.classList.remove('hidden');
    });

    // Detecta clicks en los botones de editar/eliminar de la tabla
    usersTableBody.addEventListener('click', async (e) => {
        const actionTarget = e.target.closest('.action-btn');
        const rowTarget = e.target.closest('tr');

        if (!rowTarget) return;

        const userId = rowTarget.dataset.id;
        
        if (actionTarget) {
            if (actionTarget.classList.contains('edit-btn')) {
                const user = allUsers.find(u => u._id === userId);
                document.getElementById('user-id').value = user._id;
                document.getElementById('user-name').value = user.nombre;
                document.getElementById('user-email').value = user.email;
                document.getElementById('user-password').value = '';
                document.getElementById('user-password').placeholder = "Dejar en blanco para no cambiar";
                userFormTitle.textContent = 'Editar Usuario';
                usersListContainer.classList.add('hidden');
                userFormContainer.classList.remove('hidden');
            } else if (actionTarget.classList.contains('delete-btn')) {
                const user = allUsers.find(u => u._id === userId);
                showConfirmation(
                    `¿Estás seguro de que quieres eliminar a ${user.nombre}?`,
                    async () => {
                        try {
                            await api.deleteUser(userId);
                            showNotification('Usuario eliminado correctamente', 'success');
                            await loadAdminData();
                        } catch (error) {
                            console.error('Error al eliminar usuario:', error);
                            showNotification(error.message, 'error');
                        }
                    },
                    '#ff0080'
                );
            }
        }
    });

    // Filtra la tabla de usuarios según lo que escribes en el buscador
    document.getElementById('user-search-input').addEventListener('keyup', (e) => {
        const filter = e.target.value.toLowerCase();
        const rows = usersTableBody.getElementsByTagName('tr');
        Array.from(rows).forEach(row => {
            const nameCell = row.cells[1];
            const emailCell = row.cells[2];
            if (nameCell && emailCell) {
                const nombre = nameCell.textContent.toLowerCase();
                const email = emailCell.textContent.toLowerCase();
                row.style.display = (nombre.includes(filter) || email.includes(filter)) ? '' : 'none';
            }
        });
    });

    // Cierra sesión y vuelve a la pantalla inicial
    const resetAndExit = () => {
        currentUser = null;
        token = null;
        loginForm.reset();
        registerForm.reset();
        setActiveLink(navLinks[0]);
        if (adminNavLinks.length > 0) setActiveAdminLink(adminNavLinks[0]);
        showView(landingContainer);
    };

    logoutBtn.addEventListener('click', resetAndExit);
    adminLogoutBtn.addEventListener('click', resetAndExit);
    exitAppBtn.addEventListener('click', resetAndExit);

    // Funciones auxiliares
    // Rellena los datos del perfil del usuario en la pantalla
    function populateUserProfile(user) {
        displayName.textContent = user.nombre || 'Usuario';
        displayEmail.textContent = user.email || '';
        displayAge.textContent = user.edad || '-';
        displayGender.textContent = genderMap[user.sexo] || '-';
        displayObjective.textContent = objectiveMap[user.objetivo] || '-';
    }
    
    //  menú y seccion correspondiente
    function setActiveLink(link) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const targetId = link.getAttribute('data-target');
        contentSections.forEach(section => {
            section.classList.toggle('active', section.id === targetId);
        });
    }

    // Lo mismo pero para el menú del administrador
    function setActiveAdminLink(link) {
        adminNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const targetId = link.getAttribute('data-target');
        adminContentSections.forEach(section => {
            section.classList.toggle('active', section.id === targetId);
        });
    }

    // Crea las filas de la tabla de usuarios con los datos del servidor
    function renderUsersTable(users = []) {
        usersTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.id = user._id;
            const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
            const roleBadge = user.role === 'admin' ? '<span style="color: #39ff14;"> Admin</span>' : 'Usuario';
            row.innerHTML = `
                <td>${user._id.slice(-6)}</td>
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td>${roleBadge}</td>
                <td>${joinDate}</td>
                <td>
                    <button class="action-btn edit-btn">✏️</button>
                    <button class="action-btn delete-btn">🗑️</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    }

    // Arranca la aplicación mostrando la pantalla de bienvenida
    showView(landingContainer);
});
