 if (type === "yesno") {
      options = [{ text: "Yes" }, { text: "No" }];
    } else if (type === "single") {
      const parsed = JSON.parse(req.body.options || "[]");
      options = parsed
        .filter((t) => t && t.trim())
        .map((t) => ({ text: t.trim() }));
      if (options.length < 2)
        return res.status(400).json({ message: "Add at least 2 options" });
    } else if (type === "image") {
      if (!req.files || req.files.length < 2)
        return res.status(400).json({ message: "Add at least 2 images" });
      const urls = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer)),
      );
      options = urls.map((image) => ({ image, text: "" }));
    }