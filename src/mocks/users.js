const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: '***********',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345'
    },
    phone: '555-1234',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '***********',
    address: {
      street: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zip: '62701'
    },
    phone: '555-5678',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: '***********',
    address: {
      street: '789 Pine Rd',
      city: 'Portland',
      state: 'OR',
      zip: '97201'
    },
    phone: '555-9012',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    password: '***********',
    address: {
      street: '321 Elm St',
      city: 'Denver',
      state: 'CO',
      zip: '80201'
    },
    phone: '555-3456',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: '***********',
    address: {
      street: '654 Maple Dr',
      city: 'Austin',
      state: 'TX',
      zip: '73301'
    },
    phone: '555-7890',
    createdAt: new Date(Date.now() - 75 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 6,
    name: 'Diana Martinez',
    email: 'diana@example.com',
    password: '***********',
    address: {
      street: '987 Cedar Ln',
      city: 'Seattle',
      state: 'WA',
      zip: '98101'
    },
    phone: '555-2345',
    createdAt: new Date(Date.now() - 90 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 7,
    name: 'Edward Garcia',
    email: 'edward@example.com',
    password: '***********',
    address: {
      street: '147 Birch Blvd',
      city: 'Miami',
      state: 'FL',
      zip: '33101'
    },
    phone: '555-6789',
    createdAt: new Date(Date.now() - 105 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 8,
    name: 'Fiona Davis',
    email: 'fiona@example.com',
    password: '***********',
    address: {
      street: '258 Walnut St',
      city: 'Boston',
      state: 'MA',
      zip: '02101'
    },
    phone: '555-0123',
    createdAt: new Date(Date.now() - 120 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 9,
    name: 'George Wilson',
    email: 'george@example.com',
    password: '***********',
    address: {
      street: '369 Spruce Ave',
      city: 'Chicago',
      state: 'IL',
      zip: '60601'
    },
    phone: '555-4567',
    createdAt: new Date(Date.now() - 135 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 10,
    name: 'Hannah Moore',
    email: 'hannah@example.com',
    password: '***********',
    address: {
      street: '480 Ash Ct',
      city: 'Phoenix',
      state: 'AZ',
      zip: '85001'
    },
    phone: '555-8901',
    createdAt: new Date(Date.now() - 150 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 11,
    name: 'Ivan Taylor',
    email: 'ivan@example.com',
    password: '***********',
    address: {
      street: '591 Poplar Way',
      city: 'Nashville',
      state: 'TN',
      zip: '37201'
    },
    phone: '555-2346',
    createdAt: new Date(Date.now() - 165 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 12,
    name: 'Julia Anderson',
    email: 'julia@example.com',
    password: '***********',
    address: {
      street: '702 Willow Rd',
      city: 'San Diego',
      state: 'CA',
      zip: '92101'
    },
    phone: '555-6780',
    createdAt: new Date(Date.now() - 180 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 13,
    name: 'Kevin Thomas',
    email: 'kevin@example.com',
    password: '***********',
    address: {
      street: '813 Cherry St',
      city: 'Philadelphia',
      state: 'PA',
      zip: '19101'
    },
    phone: '555-1235',
    createdAt: new Date(Date.now() - 195 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 14,
    name: 'Laura Jackson',
    email: 'laura@example.com',
    password: '***********',
    address: {
      street: '924 Hickory Ln',
      city: 'Columbus',
      state: 'OH',
      zip: '43201'
    },
    phone: '555-5679',
    createdAt: new Date(Date.now() - 210 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 15,
    name: 'Michael White',
    email: 'michael@example.com',
    password: '***********',
    address: {
      street: '135 Redwood Dr',
      city: 'Atlanta',
      state: 'GA',
      zip: '30301'
    },
    phone: '555-9013',
    createdAt: new Date(Date.now() - 225 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 16,
    name: 'Natalie Harris',
    email: 'natalie@example.com',
    password: '***********',
    address: {
      street: '246 Sycamore Blvd',
      city: 'Minneapolis',
      state: 'MN',
      zip: '55401'
    },
    phone: '555-3457',
    createdAt: new Date(Date.now() - 240 * 60 * 1000),
    updatedAt: new Date()
  },
];


export { users };