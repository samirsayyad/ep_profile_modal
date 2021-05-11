var pad_users =[
    {a:"1",last_seen_timestamp : 0},
    {a:"1",last_seen_timestamp : 0},
    {a:"1",last_seen_timestamp : 0},
    {a:"1",last_seen_timestamp : 0},
    {a:"1",last_seen_timestamp : 0},
    {a:"1",last_seen_timestamp : 0},
    {a:"1",last_seen_timestamp : 0},
    {a:"1",last_seen_timestamp : 0},
    {a:"1",last_seen_timestamp : 0},
    {a:"1" },
    {a:"1",last_seen_timestamp : 03},
    {a:"1",last_seen_timestamp : 03},
    {a:"1",last_seen_timestamp : 540},
    {a:"1" },
    {a:"1" },

]
pad_users.sort((a,b) => ((b.last_seen_timestamp) ? (b.last_seen_timestamp) : 0  ) - ((a.last_seen_timestamp) ? (a.last_seen_timestamp) : 0  ))

console.log(pad_users)