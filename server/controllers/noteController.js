import mongoose from "mongoose";
import Note from "../models/Note.js";

// CREATE NOTE
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (!trimmedContent) {
      return res.status(400).json({
        success: false,
        message: "Content cannot be empty",
      });
    }

    const note = await Note.create({
      title: trimmedTitle,
      content: trimmedContent,
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the note",
    });
  }
};

// GET ALL MY NOTES
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
    }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching notes",
    });
  }
};

// GET ONE NOTE
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    const note = await Note.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Get note error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the note",
    });
  }
};

// UPDATE NOTE
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return res.status(400).json({
        success: false,
        message: "Title and content cannot be empty",
      });
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      {
        title: trimmedTitle,
        content: trimmedContent,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Update note error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the note",
    });
  }
};

// DELETE NOTE
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    const note = await Note.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the note",
    });
  }
};