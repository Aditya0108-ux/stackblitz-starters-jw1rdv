const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const PORT = process.env.port || 3011;
let db;

(async () => {
  db = await open({
    filename: 'courses_database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Courses API!');
});

/* Exercise 1: Fetch Courses by Minimum Rating 
http://localhost:3000/courses/rating?minRating=4 */

async function filterCoursesByRating(minRating) {
  let query = 'SELECT * from courses WHERE rating > ?';
  let response = await db.all(query, [minRating]);
  return { courses: response };
}

app.get('/courses/rating', async (req, res) => {
  try {
    let minRating = req.query.minRating;
    let results = await filterCoursesByRating(minRating);
    if (results.courses.length === 0) {
      return res.status(404).json({
        message: 'No courses found with a rating greater than ' + minRating,
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/* Exercise 2: Fetch Courses by Instructor and Minimum Duration
http://localhost:3000/courses/instructor-duration?instructor=Instructor%20A&minDuration=7 */

async function filterCoursesByInstructorAndDuration(instructor, minDuration) {
  let query = 'SELECT * from courses WHERE instructor = ? AND duration > ?';
  let response = await db.all(query, [instructor, minDuration]);
  return { courses: response };
}

app.get('/courses/instructor-duration', async (req, res) => {
  try {
    let instructor = req.query.instructor;
    let minDuration = req.query.minDuration;
    let results = await filterCoursesByInstructorAndDuration(
      instructor,
      minDuration
    );
    if (results.courses.length === 0) {
      return res.status(404).json({
        message:
          'No courses found based on the ' +
          instructor +
          ' and greater than ' +
          minDuration,
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/* Exercise 3: Fetch Courses Ordered by Price
http://localhost:3000/courses/ordered-by-price */

async function fetchCoursesOrderedByPrice() {
  let query = 'SELECT * from courses ORDER BY price DESC';
  let response = await db.all(query, []);
  return { courses: response };
}

app.get('/courses/ordered-by-price', async (req, res) => {
  try {
    let results = await fetchCoursesOrderedByPrice();
    if (results.courses.length === 0) {
      return res.status(404).json({
        message: 'No courses found by price in descending order.',
      });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost : ${PORT}`);
});
