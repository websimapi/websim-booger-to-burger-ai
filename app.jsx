import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
const room = new WebsimSocket();
const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});
function App() {
  return /* @__PURE__ */ jsxDEV("main", { children: [
    /* @__PURE__ */ jsxDEV("h1", { children: "Booger to Burger \u{1F354}" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 17,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("p", { children: "Upload an image of a... specimen... and our AI chef will transform its essence into a gourmet burger masterpiece." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 18,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Uploader, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 19,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(Gallery, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 20,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 16,
    columnNumber: 9
  }, this);
}
function Uploader() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setStatus("checking");
    setError(null);
    setResult(null);
    try {
      const imageDataUrl = await readFileAsDataURL(file);
      const checkCompletion = await websim.chat.completions.create({
        messages: [{ role: "user", content: [
          { type: "text", text: `Is this image a photo of a booger, mucus, or something similarly gross and biological that could plausibly be called a "specimen" in a joking way? Respond with JSON: {"isSpecimen": boolean, "reasoning": "your reasoning"}.` },
          { type: "image_url", image_url: { url: imageDataUrl } }
        ] }],
        json: true
      });
      const { isSpecimen, reasoning } = JSON.parse(checkCompletion.content);
      if (!isSpecimen) {
        setError(`Upload rejected: ${reasoning}`);
        setStatus("error");
        return;
      }
      setStatus("describing");
      const descCompletion = await websim.chat.completions.create({
        messages: [{ role: "user", content: [
          { type: "text", text: "Describe this image in extreme, vivid, and almost grotesque detail. Focus on textures, colors, shapes, and consistency. Be very descriptive." },
          { type: "image_url", image_url: { url: imageDataUrl } }
        ] }]
      });
      const description = descCompletion.content;
      setStatus("prompting");
      const promptCompletion = await websim.chat.completions.create({
        messages: [
          { role: "system", content: "You are a creative chef that turns abstract descriptions into detailed, appetizing prompts for an AI image generator to create a picture of a gourmet burger. Translate textures, colors, and shapes into food ingredients. Make it sound delicious and high-end." },
          { role: "user", content: `Take this description: "${description}" and create a detailed prompt for generating a photorealistic image of a single, gourmet burger on a simple plate. Translate the characteristics into burger ingredients. Make the final prompt a single paragraph.` }
        ]
      });
      const burgerPrompt = promptCompletion.content;
      setStatus("generating");
      const imageGenResult = await websim.imageGen({
        prompt: `${burgerPrompt}, food photography, studio lighting, delicious`,
        aspect_ratio: "1:1"
      });
      const burgerImageUrl = imageGenResult.url;
      const originalImageUrl = await websim.upload(file);
      await room.collection("burgers").create({
        originalImageUrl,
        burgerImageUrl,
        description,
        prompt: burgerPrompt
      });
      setResult({ originalImageUrl, burgerImageUrl });
      setStatus("success");
    } catch (e) {
      console.error(e);
      setError("An unexpected error occurred. Please try again.");
      setStatus("error");
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "upload-container", children: [
      /* @__PURE__ */ jsxDEV("input", { type: "file", id: "imageUpload", accept: "image/*", className: "hidden", onChange: handleFileChange, disabled: status !== "idle" && status !== "error" && status !== "success" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 109,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("label", { htmlFor: "imageUpload", className: `upload-btn ${status !== "idle" && status !== "error" && status !== "success" ? "opacity-50 cursor-not-allowed" : ""}`, children: status === "idle" || status === "error" || status === "success" ? "Upload Image" : "Processing..." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 110,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 108,
      columnNumber: 13
    }, this),
    status !== "idle" && status !== "success" && /* @__PURE__ */ jsxDEV("div", { className: "result-step", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center space-x-2", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "loader" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 118,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: [
        status === "checking" && "Analyzing specimen...",
        status === "describing" && "Writing description...",
        status === "prompting" && "Creating recipe...",
        status === "generating" && "Cooking the burger..."
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 119,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 117,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 116,
      columnNumber: 17
    }, this),
    status === "error" && /* @__PURE__ */ jsxDEV("div", { className: "p-4 mt-4 text-sm text-red-700 bg-red-100 rounded-lg", role: "alert", children: error }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 129,
      columnNumber: 36
    }, this),
    status === "success" && result && /* @__PURE__ */ jsxDEV("div", { className: "result-step", children: [
      /* @__PURE__ */ jsxDEV("h2", { children: "Your Burger is Ready!" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 133,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-center mb-4", children: "It has been added to the gallery below." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 134,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-center", children: "Original" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 137,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("img", { src: result.originalImageUrl, alt: "Original specimen" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 138,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 136,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-center", children: "Burger" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 141,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("img", { src: result.burgerImageUrl, alt: "Generated burger" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 142,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 140,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 135,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 132,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 107,
    columnNumber: 9
  }, this);
}
function Gallery() {
  const { data: burgers, loading } = useQuery(room.query(
    `SELECT b.id, b.originalImageUrl, b.burgerImageUrl, u.username
         FROM public.burgers b
         JOIN public.user u ON b.user_id = u.id
         ORDER BY b.created_at DESC
         LIMIT 20`
  ));
  return /* @__PURE__ */ jsxDEV("div", { className: "mt-12", children: [
    /* @__PURE__ */ jsxDEV("h3", { children: "Gallery of Gourmet Burgers" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 162,
      columnNumber: 13
    }, this),
    loading && /* @__PURE__ */ jsxDEV("div", { className: "loader" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 163,
      columnNumber: 25
    }, this),
    burgers && burgers.length === 0 && /* @__PURE__ */ jsxDEV("p", { className: "text-center", children: "No burgers have been created yet. Be the first!" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 164,
      columnNumber: 49
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: burgers?.map((burger) => /* @__PURE__ */ jsxDEV("div", { className: "border rounded-lg p-3 bg-gray-50", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxDEV("img", { src: burger.originalImageUrl, alt: "Original", className: "rounded-md aspect-square object-cover" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 169,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("img", { src: burger.burgerImageUrl, alt: "Burger", className: "rounded-md aspect-square object-cover" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 170,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 168,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500 mt-2 text-center", children: [
        "Created by: ",
        burger.username
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 172,
        columnNumber: 25
      }, this)
    ] }, burger.id, true, {
      fileName: "<stdin>",
      lineNumber: 167,
      columnNumber: 21
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 165,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 161,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 183,
  columnNumber: 13
}));
