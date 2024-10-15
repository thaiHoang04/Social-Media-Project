export const Group = (id, name, role, groupPicture, memberNumbers = 0, groupStatus, intro, members = []) => ({
    id,
    name,
    role,
    groupPicture,
    memberNumbers,
    groupStatus,
    intro,
    members
});

export const modelgroups = [
    Group(
        '1',
        'RMIT Society',
        'Member',
        "/images/rmitlib.jpg",
        15,
        'Private',
        'This is a group for RMIT students to share their thoughts and ideas.',
        [
            'John',
            'Jane',
            'Michael',
            'Emily',
            'David',
            'Sarah',
            'Daniel',
            'Olivia',
            'Matthew',
            'Sophia',
            'Andrew',
            'Isabella',
            'William',
            'Ava',
            'James'
        ]
    ),
    Group(
        2,
        'RMIT MarketPlace',
        'Member',
        "/images/rmitb2.jpg",
        15,
        'Private',
        'This is a group for RMIT students to buy and sell their merchandises.',
        [
            'John',
            'Jane',
            'Michael',
            'Emily',
            'David',
            'Sarah',
            'Daniel',
            'Olivia',
            'Matthew',
            'Sophia',
            'Andrew',
            'Isabella',
            'William',
            'Ava',
            'James'
        ]
    )
    // {
    //     name: 'RMIT SSETS',
    //     status: 'Public',
    //     members: 1250,
    //     introduction: 'This is a group for RMIT students to share their thoughts and ideas about Tech.'
    // }
];