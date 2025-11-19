const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 모든 프로젝트 가져오기 (카테고리별로 그룹화)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM projects ORDER BY category, id';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Projects 조회 에러:', err);
            return res.status(500).json({ error: err.message });
        }
        
        // 카테고리별로 그룹화
        const grouped = results.reduce((acc, project) => {
            if (!acc[project.category]) {
                acc[project.category] = [];
            }
            acc[project.category].push({
                id: project.id,
                name: project.name,
                description: project.description,
                thumbnail: project.thumbnail,
                githubLink: project.github_link,
                likes: project.likes,
                views: project.views,
                downloads: project.downloads
            });
            return acc;
        }, {});
        
        console.log('✅ 프로젝트 데이터 전송:', Object.keys(grouped));
        res.json(grouped);
    });
});

// 프로젝트 조회수 증가
router.post('/:id/view', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE projects SET views = views + 1 WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        // 업데이트된 조회수 반환
        db.query('SELECT views FROM projects WHERE id = ?', [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ 프로젝트 ${id} 조회수 증가: ${results[0].views}`);
            res.json({ views: results[0].views });
        });
    });
});

// 프로젝트 좋아요 증가
router.post('/:id/like', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE projects SET likes = likes + 1 WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        // 업데이트된 좋아요 수 반환
        db.query('SELECT likes FROM projects WHERE id = ?', [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ 프로젝트 ${id} 좋아요 증가: ${results[0].likes}`);
            res.json({ likes: results[0].likes });
        });
    });
});

// 프로젝트 다운로드 수 증가
router.post('/:id/download', (req, res) => {
    const { id } = req.params;
    const query = 'UPDATE projects SET downloads = downloads + 1 WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        // 업데이트된 다운로드 수 반환
        db.query('SELECT downloads FROM projects WHERE id = ?', [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ 프로젝트 ${id} 다운로드 증가: ${results[0].downloads}`);
            res.json({ downloads: results[0].downloads });
        });
    });
});

// 프로젝트 추가 (Admin용)
router.post('/', (req, res) => {
    const { name, description, category, thumbnail, githubLink } = req.body;
    
    // 유효성 검사
    if (!name || !description || !category) {
        return res.status(400).json({ error: '이름, 설명, 카테고리는 필수입니다' });
    }
    
    const query = `
        INSERT INTO projects (name, description, category, thumbnail, github_link, likes, views, downloads) 
        VALUES (?, ?, ?, ?, ?, 0, 0, 0)
    `;
    
    db.query(query, [name, description, category, thumbnail || '', githubLink || ''], (err, result) => {
        if (err) {
            console.error('프로젝트 추가 에러:', err);
            return res.status(500).json({ error: err.message });
        }
        
        console.log(`✅ 프로젝트 추가 성공: ${name}`);
        res.status(201).json({
            id: result.insertId,
            name,
            description,
            category,
            thumbnail: thumbnail || '',
            githubLink: githubLink || '',
            likes: 0,
            views: 0,
            downloads: 0
        });
    });
});

// 프로젝트 수정 (Admin용)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, category, thumbnail, githubLink, likes, views, downloads } = req.body;
    
    const query = `
        UPDATE projects 
        SET name = ?, description = ?, category = ?, thumbnail = ?, github_link = ?, 
            likes = ?, views = ?, downloads = ?
        WHERE id = ?
    `;
    
    db.query(query, [name, description, category, thumbnail, githubLink, likes, views, downloads, id], (err, result) => {
        if (err) {
            console.error('프로젝트 수정 에러:', err);
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        console.log(`✅ 프로젝트 수정 성공: ID ${id}`);
        res.json({ message: '프로젝트가 수정되었습니다' });
    });
});

// 프로젝트 삭제 (Admin용)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM projects WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('프로젝트 삭제 에러:', err);
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        console.log(`✅ 프로젝트 삭제 성공: ID ${id}`);
        res.json({ message: '프로젝트가 삭제되었습니다' });
    });
});

module.exports = router;