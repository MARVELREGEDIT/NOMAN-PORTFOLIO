import { db } from "hatchable";

export const access = "public";
export const methods = ["POST"];

const services = ["B2B Lead Generation", "Graphic Designing", "Content Writing", "SEO Services", "Digital Marketing", "Multiple Services", "Other"];
const budgets = ["Not Decided Yet", "Under $100", "$100–$500", "$500–$1,000", "$1,000+"];

export default async function (req, res) {
  const body = req.body || {};
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const service = typeof body.service === "string" ? body.service.trim() : "";
  const budget = typeof body.budget === "string" ? body.budget.trim() : "Not Decided Yet";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const honeypot = typeof body.website === "string" ? body.website.trim() : "";

  if (honeypot) return res.json({ ok: true, message: "Thank you. Your inquiry has been received." });
  if (!fullName || fullName.length > 100) return res.status(400).json({ error: "Please enter your name (up to 100 characters)." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ error: "Please enter a valid email address." });
  if (!services.includes(service)) return res.status(400).json({ error: "Please choose one of the listed services." });
  if (!budgets.includes(budget)) return res.status(400).json({ error: "Please choose a valid budget range." });
  if (message.length < 15 || message.length > 4000) return res.status(400).json({ error: "Please add a project message between 15 and 4,000 characters." });

  try {
    const recent = await db.query("SELECT count(*)::int AS total FROM inquiries WHERE email = $1 AND created_at > now() - interval '1 hour'", [email]);
    if (Number(recent.rows[0].total) >= 3) return res.status(429).json({ error: "There have been several recent inquiries from this email. Please try again later." });
    await db.query("INSERT INTO inquiries (full_name, email, service, budget, message) VALUES ($1, $2, $3, $4, $5)", [fullName, email, service, budget, message]);
    return res.status(201).json({ ok: true, message: "Thank you. Your project inquiry has been received." });
  } catch (error) {
    console.error("Contact inquiry could not be saved:", error && error.message ? error.message : "unknown error");
    return res.status(500).json({ error: "We could not save your inquiry right now. Please try again shortly." });
  }
}