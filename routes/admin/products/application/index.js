const router = require("express").Router();
const ProductApplication = require("../../../../models/ProductApplication");

// Route to get all product applications
router.get("/", async (req, res) => {
  try {
    const applications = await ProductApplication.find();
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Route to add a new product application
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Application name is required" });
        }

        const newApplication = new ProductApplication({ name });
        await newApplication.save();
        res.status(201).json(newApplication);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { name, description } = req.body;
        const { id } = req.params;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Application name is required" });
        }

        const updatedApplication = await ProductApplication.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedApplication = await ProductApplication.findByIdAndDelete(id);

        if (!deletedApplication) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({ message: "Application deleted successfully", deletedApplication });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;