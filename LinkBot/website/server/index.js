const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const templateRoutes = require('./routes/templates');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/payments');
const withdrawalRoutes = require('./routes/withdrawals');
const bankAccountRoutes = require('./routes/bankAccounts');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    // Create default Super Admin user if not exists
    const existingAdmin = await User.findOne({ email: 'ahmii@example.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('ahmedraza', 10);
      const superAdmin = new User({
        email: 'ahmii@example.com',
        password: hashedPassword,
        role: 'super_admin',
        profile: {
          firstName: 'Super',
          lastName: 'Admin',
        },
      });
      await superAdmin.save();
      console.log('Default Super Admin created: email=ahmii@example.com, password=ahmedraza');
    }
  })
  .catch(err => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));