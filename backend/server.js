const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Thay thế bằng username MySQL của bạn
    password: 'admin', // Thay thế bằng password MySQL của bạn
    database: 'wbgamedb' // Thay thế bằng tên database của bạn
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL: ' + err.stack);
        return;
    }
    console.log('Kết nối thành công đến MySQL');
});

// Các API endpoint sẽ được thêm vào đây

const PORT = 3001; // Thay đổi port nếu cần
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});

app.get('/games', (req, res) => {
    db.query('SELECT * FROM games', (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.stack);
            res.status(500).send('Lỗi server');
            return;
        }
        res.json(results);
    });
});

app.get('/games/:id', (req, res) => {
    const gameId = req.params.id;
    db.query('SELECT * FROM games WHERE id = ?', [gameId], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.stack);
            res.status(500).send('Lỗi server');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Không tìm thấy game');
            return;
        }
        res.json(results[0]);
    });
});

app.get('/games/search', (req, res) => {
    const keyword = req.query.q;
    if (!keyword) {
        res.status(400).send('Thiếu từ khóa tìm kiếm');
        return;
    }
    const query = 'SELECT * FROM games WHERE name LIKE ? OR category LIKE ?';
    const searchTerm = `%${keyword}%`;
    db.query(query, [searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.stack);
            res.status(500).send('Lỗi server');
            return;
        }
        res.json(results);
    });
});

app.get('/games/filter', (req, res) => {
    const category = req.query.category;
    if (!category) {
        res.status(400).send('Thiếu thể loại');
        return;
    }
    db.query('SELECT * FROM games WHERE category = ?', [category], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.stack);
            res.status(500).send('Lỗi server');
            return;
        }
        res.json(results);
    });
});

app.put('/games/:id/like', (req, res) => {
    const gameId = req.params.id;
    db.query('UPDATE games SET likes = likes + 1 WHERE id = ?', [gameId], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.stack);
            res.status(500).send('Lỗi server');
            return;
        }
        res.send('Đã thích game');
    });
});

app.put('/games/:id/dislike', (req, res) => {
    const gameId = req.params.id;
    db.query('UPDATE games SET dislikes = dislikes + 1 WHERE id = ?', [gameId], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn MySQL: ' + err.stack);
            res.status(500).send('Lỗi server');
            return;
        }
        res.send('Đã không thích game');
    });
});