const usersDatabase = [
    { id: 101, name: "Usta Jamshid", avatar: "avatar1.jpg", type: "direct" },
    { id: 102, name: "Qurilish Market", avatar: "avatar2.jpg", type: "group" }
];

function searchMessages(query) {
    const chatList = document.getElementById('chatList');
    const filtered = usersDatabase.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase())
    );

    chatList.innerHTML = filtered.map(user => `
        <div class="chat-item" onclick="openConversation(${user.id}, '${user.name}', '${user.avatar}')">
            <img src="${user.avatar}" class="user-mini-avatar">
            <div class="chat-item-info">
                <h4>${user.name}</h4>
                <p>${user.type === 'group' ? 'Guruh' : 'Lichka'}</p>
            </div>
        </div>
    `).join('');
}