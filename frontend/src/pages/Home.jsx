// import React from 'react';

// export default function Home() {
//     const guestbookMessages = [
//         { author: "A", message: "aaaaaaaa" },
//         { author: "B", message: "bbbbbbbbb" },
//         { author: "C", message: "ccccccccc" },
//         { author: "D", message: "dddddddddd" },
//         { author: "E", message: "eeeeeeeeee" },
//         { author: "F", message: "fffffffff" },
//         { author: "G", message: "gggggggg" }
//     ];

//     const duplicatedMessages = [...guestbookMessages, ...guestbookMessages];

//     return (
//         <div className="home-page">
//         <h1>Taeyoung <br /> Kang</h1>
//         <p>
//             <span className="type" style={{ "--n": 82 }}>
//             Hi! I'm a Computer Science student at UW-Madison, eager to learn and hone my craft as a developer!
//             </span>
//         </p>

//         {/* Guestbook Animation */}
//         <div className="guestbook-container">
//             <div className="guestbook-scroll">
//             {duplicatedMessages.map((msg, index) => (
//                 <div key={index} className="guestbook-item">
//                 <div className="guestbook-author">{msg.author}</div>
//                 <div className="guestbook-message">{msg.message}</div>
//                 </div>
//             ))}
//             </div>
//         </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';

export default function Home() {
    const [guestbookMessages, setGuestbookMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuestbook = async () => {
            try {
                console.log('🔄 방문록 가져오는 중...');
                const response = await fetch('/api/guestbook');
                const data = await response.json();
                
                console.log('✅ 방문록 데이터:', data);
                
                // 데이터가 없으면 기본 메시지 표시
                if (data.length === 0) {
                    setGuestbookMessages([
                        { nickname: 'Guest', message: 'Be the first to leave a message!' }
                    ]);
                } else {
                    setGuestbookMessages(data);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('❌ 방문록 가져오기 실패:', error);
                setGuestbookMessages([
                    { nickname: 'Guest', message: 'Welcome to my portfolio!' }
                ]);
                setLoading(false);
            }
        };

        fetchGuestbook();
    }, []);

    // 메시지를 2번 복사해서 무한 스크롤처럼 보이게
    const duplicatedMessages = [...guestbookMessages, ...guestbookMessages];

    return (
        <div className="home-page">
            <h1>Taeyoung <br /> Kang</h1>
            <p>
                <span className="type" style={{ "--n": 82 }}>
                    Hi! I'm a Computer Science student at UW-Madison, eager to learn and hone my craft as a developer!
                </span>
            </p>

            {/* Guestbook Animation */}
            <div className="guestbook-container">
                <div className="guestbook-scroll">
                    {loading ? (
                        <div className="guestbook-item">
                            <div className="guestbook-message">Loading messages...</div>
                        </div>
                    ) : (
                        duplicatedMessages.map((msg, index) => (
                            <div key={index} className="guestbook-item">
                                <div className="guestbook-author">{msg.nickname}</div>
                                <div className="guestbook-message">{msg.message}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
