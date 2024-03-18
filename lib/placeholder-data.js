const { group } = require("console");

const users = [
  {
    id: '3106eb8a-3288-4b62-a077-3b24bd640d9a',
    firstName: 'Gabe',
    lastName: 'Mata',
    email: 'gabe@mata.com',
    password: 'gabe',
  },
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    firstName: 'Rollo',
    lastName: 'KD',
    email: 'rollo@nextmail.com',
    password: '12345678',
  },
  {
    id: "9eb625bd-239c-49bd-965f-ca7f62774832",
    firstName: 'Ola',
    lastName: 'Smolna',
    email: 'ola@nextmail.com',
    password: 'password',
  },
  {
    id: "9ec739f9-d23b-4410-8f1a-c29e0431e0a6",
    firstName: 'Sebastian',
    lastName: 'Arteaga',
    email: 'seb@nextmail.com',
    password: 'admin',
  },
  {
    id: "abde2287-4cfa-4cc7-b810-dd119df1d039",
    firstName: 'Enes',
    lastName: 'Jakupi',
    email: 'enes@nextmail.com',
    password: 'testing',
  },
];

const groups = [
  {
    id: '5909a47f-9577-4e96-ad8d-7af0d52c3267',
    name: 'Group One',
    date: '2024-03-01',
    status: true,
  },
  {
    id: 'cc65048d-a8ee-47fb-851b-5a528e896cc1',
    name: 'Group Two',
    date: '2024-03-15',
    status: false,
  },
  {
    id: '20328e6f-167b-4fb9-bb5e-c71580f59cd5',
    name: 'Group Three',
    date: '2024-03-18',
    status: false,
  },
  {
    id: '5795cd8a-364f-4e21-8909-be58ce9cc9ce',
    name: 'Group Four',
    date: '2024-03-10',
    status: false,
  },
  {
    id: '76fd1215-5c47-40c2-a964-a8c5742ed6e2',
    name: 'Group Five',
    date: '2024-02-15',
    status: false,
  },
];

const userGroups = [
  {
    userId:users[0].id,
    groupId:groups[0].id,
  },
  {
    userId:users[0].id,
    groupId:groups[1].id,
  },
  {
    userId:users[3].id,
    groupId:groups[1].id,
  },
  {
    userId:users[3].id,
    groupId:groups[0].id,
  },
  {
    userId:users[1].id,
    groupId:groups[2].id,
  },
  {
    userId:users[1].id,
    groupId:groups[3].id,
  },
  {
    userId:users[2].id,
    groupId:groups[4].id,
  },
  {
    userId:users[2].id,
    groupId:groups[2].id,
  },
  {
    userId:users[4].id,
    groupId:groups[2].id,
  },
  {
    userId:users[4].id,
    groupId:groups[4].id,
  },
]

const transactions = [
  {
    id:'89acf65b-0f9e-4618-8224-0368da8e90bb',
    name:'Dinner',
    date:'2024-03-01',
    amount: 5000,
    status: false,
    paid_by: users[0].id,
    group_id: groups[0].id
  },
  {
    id:'0d8b3928-9b44-4dc7-aa40-2c874fe50554',
    name:'Movies',
    date:'2024-03-01',
    amount: 5000,
    status: false,
    paid_by: users[3].id,
    group_id: groups[0].id
  },
  {
    id:'7bf040cf-f071-4682-82f6-267d53a53d7c',
    name:'Bowling',
    date:'2024-03-01',
    amount: 5000,
    status: false,
    paid_by: users[2].id,
    group_id: groups[2].id
  },
  {
    id:'02636baa-7186-48c3-be2b-aba140dc5426',
    name:'Mini Golf',
    date:'2024-03-01',
    amount: 5000,
    status: false,
    paid_by: users[4].id,
    group_id: groups[2].id
  },
  {
    id:'fa51b1a2-f2bb-4b61-a611-4ca06cf7e499',
    name:'Flights',
    date:'2024-03-01',
    amount: 5000,
    status: false,
    paid_by: users[1].id,
    group_id: groups[2].id
  },
  {
    id:'7e188871-73b9-4a60-a4de-c5654ecf153e',
    name:'dinner',
    date:'2024-03-01',
    amount: 5000,
    status: false,
    paid_by: users[1].id,
    group_id: groups[3].id
  },
]

const splits = [
  {
    id:'1',
    user_id: users[3].id,
    transaction_id: transactions[0].id,
    group_id: groups[0].id,
    amount: 5000,
    user_amount: 2500,
    paid: false,
  },
  {
    id:'1',
    user_id: users[1].id,
    transaction_id: transactions[1].id,
    group_id: groups[0].id,
    amount: 5000,
    user_amount: 2500,
    paid: false,
  },
  
]

module.exports = { users, groups, userGroups, transactions, splits };