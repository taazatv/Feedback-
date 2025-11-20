import emailjs from "@emailjs/browser";
import { FormEvent, useEffect, useState } from "react";
import Loader from "./loader";
import { format } from "date-fns";

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // <- string
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"edit" | "loading" | "sent" | "failed">(
    "edit"
  );

  // Initialize once
  useEffect(() => {
    emailjs.init("cdUZZqjrGrJht5EToS"); // <- string, not object
  }, []);

  // Validation
  useEffect(() => {
    verify();
  }, [name, email, phone, subject, message]);

  function verify() {
    const tName = name.trim();
    const tEmail = email.trim();
    const tPhone = phone.trim();
    const tSubject = subject.trim();
    const tMessage = message.trim();

    if (!tName) setErrorMessage("Enter name");
    else if (!tEmail) setErrorMessage("Enter email");
    else if (tEmail.indexOf("@") === -1 || tEmail.length <= 5)
      setErrorMessage("Enter a valid email");
    else if (!tPhone) setErrorMessage("Enter phone number");
    else if (!/^\d{10}$/.test(tPhone)) setErrorMessage("Enter a valid phone number");
    else if (!tSubject) setErrorMessage("Enter subject");
    else if (!tMessage) setErrorMessage("Enter message");
    else setErrorMessage("");

    if (status === "failed") setStatus("edit");
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (errorMessage) return; // bail out if validation error

    setStatus("loading");

    const time = format(new Date(), "EEE, dd MMM yyyy HH:mm:ss 'GMT'");

    // Make sure serviceID/templateID are correct (from your EmailJS dashboard)
    const SERVICE_ID = "service_uwa1lia";
    const TEMPLATE_ID = "template_pms1q86";
    const templateParams = {
      subject: subject.trim(),
      name: name.trim(),
      time,
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(() => {
        setStatus("sent");
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setTimeout(() => setStatus("edit"), 2500);
      })
      .catch((err) => {
        setErrorMessage(err?.text || err?.message || "Failed to send");
        setStatus("failed");
      });
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 portrait:pb-16 gap-8 ">
      {status === "loading" && (
        <div className="w-screen h-screen absolute z-50 top-0 left-0 backdrop-blur-sm flex flex-col gap-4 justify-center items-center">
          <Loader />
          <div className="font-bold text-slate-800">Sending...</div>
        </div>
      )}

      <div
        className={`absolute z-50 bottom-4 right-4 bg-green-500 pointer-events-none px-16 py-4 rounded-md ${
          status === "sent" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="font-bold text-white">Sent !</div>
      </div>

      <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide drop-shadow-md">
        FEEDBACK FORM
      </h1>

      <form
        className="w-full h-full landscape:border border-neutral-400 rounded-md flex flex-col items-center justify-center landscape:p-8 gap-4 bg-white shadow-xl p-6"
        onSubmit={submit}
      >
        <div className="w-full flex gap-4 portrait:flex-col">
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="w-full flex gap-4 portrait:flex-col">
          <input
            type="tel" // <- better for phones
            id="phone"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").substring(0, 10))}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            id="subject"
            placeholder="Enter Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <textarea
          className="w-full portrait:h-full landscape:h-[16vh] border border-neutral-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter Message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <div id="error-message" className="text-red-500 font-medium text-base self-start">
          {errorMessage}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out text-white font-bold rounded-lg shadow-md"
          disabled={!!errorMessage || status === "loading"}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
