import puppeteer from "puppeteer";

const domain = "cryptoquote-five.vercel.app";

export async function GET(req: Request) {
  const id = req?.url?.search("id");

  if (!id) {
    return new Response("URL parameter is required", { status: 400 });
  }

  const url = `https://${domain}/view/${id}`;

  let browser;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot({ type: "png" });

    return new Response(screenshot, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, {
      status: 500,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
