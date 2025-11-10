# 🔧 Environment Variables Setup Guide

## 📝 **Quick Setup**

Since `.env.local` is git-ignored, you need to create it manually with your API keys.

### **Step 1: Create `.env.local` file**

In the project root (`/Users/pranavks/MVP/jewelry-app/`), create a file named `.env.local`:

```bash
touch .env.local
```

### **Step 2: Add your API keys**

Copy and paste the following into `.env.local`:

```env
# Google Gemini AI (for text generation)
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI DALL-E 3 (for image generation)
OPENAI_API_KEY=your_openai_api_key_here

# Tavily Search API (for web scraping jewelry images)
TAVILY_API_KEY=your_tavily_api_key_here

# Cloudinary (optional - for image storage)
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

### **Step 3: Restart the dev server**

```bash
npm run dev
```

---

## 🔑 **API Keys Explained**

### **1. Gemini API Key** (Required)
- **Used for**: Generating detailed jewelry descriptions
- **Where**: Design Generator page
- **Get it**: https://makersuite.google.com/app/apikey

### **2. OpenAI API Key** (Required)
- **Used for**: Generating realistic jewelry images with DALL-E 3
- **Where**: Design Generator page
- **Get it**: https://platform.openai.com/api-keys

### **3. Tavily API Key** (Required)
- **Used for**: Web scraping real jewelry images for gallery
- **Where**: Gallery page
- **Get it**: https://tavily.com/

### **4. Cloudinary** (Optional)
- **Used for**: Storing and optimizing generated images
- **Where**: Optional in Design Generator
- **Get it**: https://cloudinary.com/

---

## ✅ **Verify Setup**

### **Check if keys are loaded:**

Add this to any API route temporarily:

```typescript
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('TAVILY_API_KEY:', process.env.TAVILY_API_KEY ? '✅ Loaded' : '❌ Missing');
```

### **Test each feature:**

1. **Design Generator**: Generate a jewelry design → Should use Gemini + DALL-E
2. **Gallery**: View gallery → Should fetch images via Tavily
3. **Dashboard**: Check saved designs → Should display properly

---

## 🚨 **Troubleshooting**

### **Problem: Keys not loading**

**Solution 1:** Make sure file is named exactly `.env.local` (not `.env.txt` or `.envlocal`)

**Solution 2:** Restart the dev server completely:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

**Solution 3:** Check file location - should be in project root:
```
jewelry-app/
├── .env.local          ← HERE
├── app/
├── components/
└── package.json
```

### **Problem: "API key not found" errors**

**Check the console logs:**
```bash
# Should see:
Fetching gallery images via Tavily: { type: 'ring', count: 20 }
```

**If you see "Tavily API key not found":**
- Double-check `.env.local` file exists
- Verify key is correct and matches your Tavily account
- Restart server

### **Problem: Gallery shows fallback images**

This means Tavily is not working. Check:
1. API key is correct
2. Server restarted after adding key
3. Network connection is stable
4. Tavily API rate limit not exceeded

**Fallback is expected behavior** - app will work with curated images if Tavily fails.

---

## 🔒 **Security Notes**

✅ **DO:**
- Keep `.env.local` git-ignored
- Never commit API keys
- Use environment variables
- Rotate keys periodically

❌ **DON'T:**
- Share keys publicly
- Commit `.env.local` to git
- Use keys in client-side code
- Hardcode keys in source files

---

## 📊 **Current Status**

✅ `.env.example` created (template)  
✅ `.env.local` should be created manually (your keys)  
✅ All API keys provided by user  
✅ Services configured to use keys  
✅ Error handling for missing keys  
✅ Fallback systems in place  

---

## 🎯 **Final Checklist**

- [ ] Created `.env.local` file
- [ ] Added Gemini API key
- [ ] Added OpenAI API key
- [ ] Added Tavily API key
- [ ] Restarted dev server
- [ ] Tested Design Generator
- [ ] Tested Gallery
- [ ] Verified console logs

---

## 🚀 **You're All Set!**

Once `.env.local` is created with your keys, your jewelry AI platform will have:

🎨 **AI Design Generation** (Gemini + DALL-E)  
🖼️ **Real-time Gallery** (Tavily web scraping)  
💾 **Optional Cloud Storage** (Cloudinary)  
🔒 **Secure API Key Management**  

**Start the server and enjoy your luxury jewelry platform!** ✨

