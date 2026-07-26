# Lesi Iskole Achievers Show

A cinematic eight-slide React awards presentation built from the supplied Lesi
Iskole visual references. The supplied clean blue/red image is the presentation
background. The original finished poster images are not used as slide
backgrounds.

## Slides and sound direction

1. **Achievers** — logo rise, 3D title impact, cinematic riser and victory chord.
2. **Monthly Performers** — 5th-to-1st staged cards, award pings and fanfare.
3. **6th Month Performers** — flying plane, Bangkok styling, jet whoosh, gong and proud chord.
4. **Battle of the Products** — product-by-product entrances, sword clashes and impact hits.
5. **Commission Update** — sequential digit reels, counting clicks, cash register and coin shower.
6. **Mission Unlock** — one result chest with a different danger/silver/gold/mega sound.
7. **Weekly Performers** — card-by-card reveal, stadium drums and winning fanfare.
8. **Congratulations** — logo, trophy, fireworks and a large finale chord.

## Editing Mode

- Edit performer names and counts.
- Upload a performer once and reuse that member on Monthly, 6th Month and Weekly slides.
- Select the rank order independently for every performer slide.
- Edit product names, sales counts and images.
- Enter the sales count once; commission and mission results update automatically.
- Save the complete presentation state to Vercel Blob.

## Presentation Mode

- Click **Start Show With Sound** to enable browser audio.
- Use the on-screen controls or keyboard:
  - `Right Arrow` or `Space`: next slide
  - `Left Arrow`: previous slide
  - `R`: replay the current animation and sound
  - `E`: return to Editing Mode
  - Fullscreen button: fill the screen

## Commission and mission rules

- Commission is **LKR 300 per sale**.
- 10,000 or more: Mega Jackpot — LKR 3,000,000.
- 9,000–9,999: Gold Zone — LKR 2,000,000.
- 8,000–8,999: Silver Zone — LKR 100,000.
- Fewer than 8,000: Danger Zone — no commission.

## Run locally

1. Install Node.js 20 or newer.
2. Extract the ZIP.
3. Open a terminal inside the project folder.
4. Run:

```bash
npm install
npm run dev
```

## Connect Cloudinary

1. Create a Cloudinary account.
2. Open **Settings → Upload**.
3. Create an **unsigned upload preset**.
4. Copy `.env.example` to `.env.local`.
5. Add the cloud name and preset:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

Without these variables, image previews still work locally for the current
browser session. With the variables, images are uploaded permanently to
Cloudinary.

## Connect Vercel Blob and deploy

1. Upload the project to GitHub.
2. Import the repository into Vercel.
3. In the Vercel project, open **Storage** and create a Blob store.
4. Connect the store to the project. Vercel adds `BLOB_READ_WRITE_TOKEN`.
5. Add both Cloudinary variables under **Settings → Environment Variables**.
6. Deploy again.

The `/api/data` serverless function stores the presentation state in
`achievers-show/state.json` inside Vercel Blob.
