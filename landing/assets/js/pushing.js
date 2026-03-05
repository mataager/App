async function createFirebaseAuthAccount(email, password, displayName) {
  try {
    // Create user in Firebase Authentication
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;

    // Update user's display name
    await user.updateProfile({
      displayName: displayName,
    });

    // Get user token
    const token = await user.getIdToken();

    return {
      success: true,
      user: user,
      token: token,
      uid: user.uid,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}

// === 3. SAVE CLIENT DATA TO REALTIME DATABASE ===
async function saveClientDataToDatabase(uid, token, formData) {
  try {
    // Calculate expiry date
    function calculateExpiryDate(planType) {
      const now = new Date();
      let expiry = new Date();

      switch (planType) {
        case "free":
          expiry.setDate(now.getDate() + 14); // 14-day trial
          break;
        case "TheOne":
        case "FastCart":
        case "FastCartplus":
        case "Matagerfull":
        case "Matagerfullplus":
          expiry.setMonth(now.getMonth() + 1); // 1 month for paid plans
          break;
        default:
          expiry.setMonth(now.getMonth() + 1);
      }
      return expiry.toISOString();
    }

    const startedAt = new Date().toISOString();
    const expDate = calculateExpiryDate(formData.plan);

    // Prepare client data for database
    const clientData = {
      userId: uid,
      // token: token,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      // storeId: formData.uid,
      businessName: formData.businessName,
      role: "client",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Save to /clients/{uid}
    await database.ref(`/clients/${uid}`).set(clientData);

    // Create store structure
    const storeData = {
      Matager: {
        Amount: 0,
        count: 0,
        cut: 0,
      },
    };
    await database.ref(`/Stores/${uid}`).set(storeData);

    // Add store-info
    const storeInfo = {
      mainInfo: {
        defaultDomain: `www.matager/dashboard/${uid}.com`,
        Domain: "",
        businessEmail: "",
        "store-name": formData.businessName,
        plan: formData.planName,
        businessPhone: formData.businessPhone,
        businessCategory: formData.businessCategory,
      },
      structureInfo: {
        Lightning: `lightmode`,
        theme: `-3847nf783`,
      },
      adminInfo: {
        "phone-number": formData.phone,
        name: formData.fullName,
        Email: formData.email,
        marketingOptIn: formData.marketingEmails,
        token: token,
        profilePic: "",
      },
      locationInfo: {
        country: formData.country,
        city: formData.city,
        district: formData.district,
      },
    };
    const billingInfo = {
      startedAt: startedAt,
      expDate: expDate,
      subType: formData.planName,
      planId: formData.plan,
      paymentMethod: formData.paymentMethod,
      autoRenew: formData.autoRenew,
      status: "active",
      price: formData.price,
      total: formData.total,
      discount: discountAmount,
      promoCode: formData.promoCode,
    };

    await database.ref(`/Stores/${uid}/store-info`).set(storeInfo);
    await database
      .ref(`/Stores/${uid}/store-info/billingInfo`)
      .push(billingInfo);

    return {
      success: true,
      clientData: clientData,
      startedAt: startedAt,
      expDate: expDate,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}
