export const registerUser = asyncHandler(async (req, res) => {
  const { email, firstname, otp } = req.body;

  const newUser = await User.create({
    email,
    firstname,
    otp,
    isVerified: false,
  });
  await sendOTPEmail(email, firstname, otp);

  await sendEmail(email, firstname);
  // Add role directly to the newUser object being sent
  const userWithRole = { ...newUser.toJSON(), role: 'user' };

  res.status(201).json({ message: "Utilisateur créé avec succès", user: userWithRole });
});

export const registerMedecin = asyncHandler(async (req, res) => {
  const { email, firstname, otp } = req.body;

  // Création du médecin avec les données nettoyées
  const newMedecin = await Medecin.create(cleanedData);

  try {
    await sendOTPEmail(email, firstname, otp); // à condition que la fonction soit importée
  } catch (error) {
    // ... existing code ...
  }
  // Add role directly to the newMedecin object being sent
  const medecinWithRole = { ...newMedecin.toJSON(), role: 'medecin' };

  res.status(201).json({ message: "Médecin créé avec succès", medecin: medecinWithRole });
}); 