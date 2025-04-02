const puppeteer = require("puppeteer");

(async () => {
    console.log("🚀 Launching browser...");
    const browser = await puppeteer.launch({ headless: false }); // Set true for background execution
    const page = await browser.newPage();

    // Step 1: Open Temp-Mail.io
    console.log("📧 Opening Temp-Mail.io...");
    await page.goto("https://temp-mail.io/en");
    await page.waitForTimeout(5000); // Wait for the email to load

    // Step 2: Extract the temporary email
    const email = await page.evaluate(() => {
        return document.querySelector(".email").textContent.trim();
    });
    console.log("📧 Temporary Email:", email);

    // Step 3: Open OpenRouter.ai and sign up
    console.log("📝 Opening OpenRouter.ai...");
    const openRouterPage = await browser.newPage();
    await openRouterPage.goto("https://openrouter.ai/");
    await openRouterPage.waitForTimeout(5000);

    await openRouterPage.click("button:contains('Sign in')");
    await openRouterPage.waitForTimeout(2000);
    await openRouterPage.click("button:contains('Sign up')");
    
    // Step 4: Fill out the signup form
    await openRouterPage.type("input[type='email']", email);
    await openRouterPage.type("input[type='password']", "16701670@oO");
    await openRouterPage.click("button[type='submit']");
    
    console.log("✅ Signed up with email:", email);

    // Step 5: Open Temp-Mail again and verify the email
    console.log("📨 Checking for verification email...");
    await page.reload();
    await page.waitForTimeout(8000);

    const verifyLink = await page.evaluate(() => {
        let link = document.querySelector("a[href*='openrouter']");
        return link ? link.href : null;
    });

    if (verifyLink) {
        console.log("✅ Verification link found! Opening...");
        const verifyPage = await browser.newPage();
        await verifyPage.goto(verifyLink);
        await verifyPage.waitForTimeout(5000);
    } else {
        console.warn("⚠️ Verification email not found! Please check manually.");
    }

    // Step 6: Open API Key Page and generate key
    console.log("🔑 Opening API Key page...");
    await openRouterPage.goto("https://openrouter.ai/settings/keys");
    await openRouterPage.waitForTimeout(5000);
    
    await openRouterPage.click("button:contains('Create Key')");
    await openRouterPage.waitForTimeout(2000);
    
    await openRouterPage.type("input[name='keyName']", "A");
    await openRouterPage.click("button:contains('Create')");

    console.log("🔑 API Key Created! Please copy it manually.");
    
    // Keep the browser open for manual review
})();