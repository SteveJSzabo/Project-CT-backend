import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, logout } from './auth';
import { createUser, editUser, deleteUser, editProfile } from './user';
import deletePopup from './utils/deletePopup';

// DOM elements
const loginBtn = document.querySelector('#login_form');
const logoutBtn = document.querySelector('#logout_btn');
const userCreateForm = document.querySelector('#user_create_form');
const userEditForm = document.querySelector('#user_edit_form');
const userDeleteBtns = document.querySelectorAll('#user_delete_btn');
const profileEditForm = document.querySelector('#profile_edit_form');

// Login Handler
if (loginBtn) {
  loginBtn.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    login({ username, password });
  });
}

// Logout Handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// Handle user create
if (userCreateForm) {
  userCreateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const bungie_membership_id = document.getElementById('bungie_membership_id')
      .value;
    const bungie_clanmember_type = document.getElementById(
      'bungie_clanmember_type'
    ).value;
    const main_class = document.getElementById('main_class').value;
    const focus = document.getElementById('focus').value;
    const player_type = document.getElementById('player_type').value;
    const description = document.getElementById('description').value;
    const steam_profile = document.getElementById('steam_profile').value;
    const youtube_profile = document.getElementById('youtube_profile').value;
    const twitch_profile = document.getElementById('twitch_profile').value;
    const avatar = document.getElementById('avatar').files[0];
    let role;
    const roleSelector = document.querySelector('#role');
    if (roleSelector) {
      role = roleSelector.options[roleSelector.selectedIndex].value;
    }

    const form = new FormData();
    form.append('name', name);
    form.append('username', username);
    form.append('password', password);
    form.append('bungie_membership_id', bungie_membership_id);
    form.append('bungie_clanmember_type', bungie_clanmember_type);
    form.append('main_class', main_class);
    form.append('focus', focus);
    form.append('player_type', player_type);
    form.append('description', description);
    form.append('steam_profile', steam_profile);
    form.append('youtube_profile', youtube_profile);
    form.append('twitch_profile', twitch_profile);
    if (avatar) form.append('avatar', avatar);
    if (role) form.append('role', role);

    createUser(form);
  });
}

// Handle user edit
if (userEditForm) {
  userEditForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const bungie_membership_id = document.getElementById('bungie_membership_id')
      .value;
    const bungie_clanmember_type = document.getElementById(
      'bungie_clanmember_type'
    ).value;
    const main_class = document.getElementById('main_class').value;
    const focus = document.getElementById('focus').value;
    const player_type = document.getElementById('player_type').value;
    const description = document.getElementById('description').value;
    const steam_profile = document.getElementById('steam_profile').value;
    const youtube_profile = document.getElementById('youtube_profile').value;
    const twitch_profile = document.getElementById('twitch_profile').value;
    const avatar = document.getElementById('avatar').files[0];
    let role;
    const roleSelector = document.querySelector('#role');
    if (roleSelector) {
      role = roleSelector.options[roleSelector.selectedIndex].value;
    }

    const userId = document.getElementById('user_id').dataset.id;

    const form = new FormData();
    form.append('name', name);
    form.append('bungie_membership_id', bungie_membership_id);
    form.append('bungie_clanmember_type', bungie_clanmember_type);
    form.append('main_class', main_class);
    form.append('focus', focus);
    form.append('player_type', player_type);
    form.append('description', description);
    form.append('steam_profile', steam_profile);
    form.append('youtube_profile', youtube_profile);
    form.append('twitch_profile', twitch_profile);
    if (avatar) form.append('avatar', avatar);
    if (role) form.append('role', role);

    editUser(userId, form);
  });
}

// User Delete Handler
deletePopup(userDeleteBtns, deleteUser);

// Handle profile edit
if (profileEditForm) {
  profileEditForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const main_class = document.getElementById('main_class').value;
    const focus = document.getElementById('focus').value;
    const player_type = document.getElementById('player_type').value;
    const description = document.getElementById('description').value;
    const steam_profile = document.getElementById('steam_profile').value;
    const youtube_profile = document.getElementById('youtube_profile').value;
    const twitch_profile = document.getElementById('twitch_profile').value;
    const avatar = document.getElementById('avatar').files[0];

    const form = new FormData();
    form.append('name', name);
    form.append('main_class', main_class);
    form.append('focus', focus);
    form.append('player_type', player_type);
    form.append('description', description);
    form.append('steam_profile', steam_profile);
    form.append('youtube_profile', youtube_profile);
    form.append('twitch_profile', twitch_profile);
    if (avatar) form.append('avatar', avatar);

    editProfile(form);
  });
}
