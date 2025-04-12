<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Profile</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>

  <!-- 🍔 Hamburger Button -->
  <button class="hamburger" id="menuToggle">☰</button>

  <!-- 👤 User Menu -->
  <div class="user-menu" id="menu">
    <a href="/app">Home</a>
    <a href="/profile">Profile</a>
    <a href="/saved-plans">Saved Plans</a>
    <a href="/contact-us">Contact</a>
    <button class="logout-btn">Logout</button>
  </div>

  <!-- 📇 Profile Section -->
  <div class="profile-container">
    <h2>My Profile</h2>
    <div class="profile-card">
      <p><strong>Name:</strong> <span id="userName">Loading...</span></p>
      <p><strong>Email:</strong> <span id="userEmail">Loading...</span></p>
    </div>
    <div class="profile-buttons">
      <button class="primary-btn logout-btn">Logout</button>
    </div>
    <a href="javascript:history.back()" class="back-button">← Back</a>
  </div>

  <!-- 👤 Profile Logic -->
  <script type="module" src="/scripts/profile.js"></script>

  <!-- ✅ Hamburger Toggle Logic -->
  <script src="/scripts/menu.js" defer></script>
</body>
</html>
