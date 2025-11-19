const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 모든 방문록 가져오기 (닉네임 마스킹)
router.get('/', (req, res) => {
    const query = 'SELECT id, nickname, message, created_at FROM guestbook ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Guestbook 조회 에러:', err);
            return res.status(500).json({ error: err.message });
        }
        
        // 닉네임 마스킹 (첫글자 * 마지막글자)
        const maskedResults = results.map(entry => {
            let maskedNickname = entry.nickname;
            if (entry.nickname.length > 2) {
                const first = entry.nickname.charAt(0);
                const last = entry.nickname.charAt(entry.nickname.length - 1);
                const middle = '*'.repeat(entry.nickname.length - 2);
                maskedNickname = first + middle + last;
            }
            
            return {
                id: entry.id,
                nickname: maskedNickname,
                message: entry.message,
                created_at: entry.created_at
            };
        });
        
        console.log(`✅ 방문록 ${maskedResults.length}개 전송`);
        res.json(maskedResults);
    });
});

// 방문록 작성하기
router.post('/', (req, res) => {
    const { nickname, message } = req.body;
    
    // 유효성 검사
    if (!nickname || !message) {
        return res.status(400).json({ error: '닉네임과 메시지를 입력해주세요' });
    }
    
    if (nickname.length < 2 || nickname.length > 20) {
        return res.status(400).json({ error: '닉네임은 2-20자여야 합니다' });
    }
    
    if (message.length > 500) {
        return res.status(400).json({ error: '메시지는 500자 이하여야 합니다' });
    }
    
    const query = 'INSERT INTO guestbook (nickname, message) VALUES (?, ?)';
    
    db.query(query, [nickname, message], (err, result) => {
        if (err) {
            console.error('방문록 작성 에러:', err);
            return res.status(500).json({ error: err.message });
        }
        
        console.log(`✅ 방문록 작성 완료: ${nickname}`);
        res.status(201).json({
            id: result.insertId,
            nickname,
            message,
            created_at: new Date()
        });
    });
});

// 방문록 삭제 (Admin용 - 나중에 사용)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM guestbook WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '방문록을 찾을 수 없습니다' });
        }
        
        console.log(`✅ 방문록 삭제 완료: ID ${id}`);
        res.json({ message: '삭제되었습니다' });
    });
});

module.exports = router;