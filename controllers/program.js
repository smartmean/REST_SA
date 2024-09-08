const Program = require("../models/Program");

//@desc     Get all programs
//@route    GET /api/v1/programs
//@access   Public
exports.getPrograms = async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort"];
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Program.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  try {
    // Execute query
    const programs = await query;

    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get one programs
//@routs    GET/api/v1/programs/:id
//@access   Public
exports.getProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Create single programs
//@routs    POST/api/v1/programs
//@access   Private
exports.createProgram = async (req, res, next) => {
  const program = await Program.create(req.body);
  res.status(201).json({
    success: true,
    data: program,
  });
};

//@desc     Update single programs
//@routs    PUT/api/v1/programs/:id
//@access   Private
exports.updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!program) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Delete single programs
//@routs    DELETE/api/v1/programs
//@access   Private
exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(400).json({ success: false });
    }

    await program.deleteOne();

    program.deleteOne();
    res.status(200).json({ success: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
