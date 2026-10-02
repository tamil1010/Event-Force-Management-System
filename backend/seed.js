require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Assignment = require('./models/Assignment');
const Notification = require('./models/Notification');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Event.deleteMany();
    await Assignment.deleteMany();
    await Notification.deleteMany();

    console.log('Seeding demo users...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@eventforce.com',
      password: 'password123',
      role: 'Admin',
      department: 'Executive Operations',
      phone: '+1 555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Available',
    });

    // 2. Create Event Managers
    const manager1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'manager@eventforce.com',
      password: 'password123',
      role: 'Event Manager',
      department: 'Event Operations',
      phone: '+1 555-0188',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Available',
    });

    const manager2 = await User.create({
      name: 'Robert Vance',
      email: 'robert.manager@eventforce.com',
      password: 'password123',
      role: 'Event Manager',
      department: 'Logistics & Security',
      phone: '+1 555-0177',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Available',
    });

    // 3. Create Force / Staff Members
    const staffMembersData = [
      {
        name: 'John Miller',
        email: 'john.security@eventforce.com',
        password: 'password123',
        role: 'Staff/Force Member',
        department: 'Security',
        phone: '+1 555-0101',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        availabilityStatus: 'Assigned',
      },
      {
        name: 'Alex Rivera',
        email: 'alex.crowd@eventforce.com',
        password: 'password123',
        role: 'Staff/Force Member',
        department: 'Crowd Control',
        phone: '+1 555-0102',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
        availabilityStatus: 'Assigned',
      },
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.medical@eventforce.com',
        password: 'password123',
        role: 'Staff/Force Member',
        department: 'Medical Support',
        phone: '+1 555-0103',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        availabilityStatus: 'Available',
      },
      {
        name: 'Mark Taylor',
        email: 'mark.logistics@eventforce.com',
        password: 'password123',
        role: 'Staff/Force Member',
        department: 'Logistics',
        phone: '+1 555-0104',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
        availabilityStatus: 'Assigned',
      },
      {
        name: 'David Chen',
        email: 'david.tech@eventforce.com',
        password: 'password123',
        role: 'Staff/Force Member',
        department: 'Tech Support',
        phone: '+1 555-0105',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        availabilityStatus: 'Available',
      },
      {
        name: 'Elena Rostova',
        email: 'elena.hospitality@eventforce.com',
        password: 'password123',
        role: 'Staff/Force Member',
        department: 'Hospitality',
        phone: '+1 555-0106',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        availabilityStatus: 'Available',
      },
      {
        name: 'Marcus Vance',
        email: 'marcus.security@eventforce.com',
        password: 'password123',
        role: 'Staff/Force Member',
        department: 'Security',
        phone: '+1 555-0107',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
        availabilityStatus: 'On Leave',
      },
    ];

    const createdStaff = await User.create(staffMembersData);

    console.log('Seeding sample events...');

    // 4. Create Events
    const eventsData = [
      {
        name: 'College Cultural Festival 2026',
        description: 'Annual mega cultural festival with live performances, art exhibits, and food stalls.',
        category: 'Cultural Festival',
        date: new Date('2026-10-15'),
        startTime: '09:00',
        endTime: '22:00',
        location: 'Main University Auditorium & Grounds',
        requiredForce: 20,
        assignedForceCount: 3,
        status: 'Upcoming',
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        createdBy: manager1._id,
      },
      {
        name: 'Global Tech Leadership Summit',
        description: 'International conference hosting C-level executives, tech founders, and keynote panels.',
        category: 'Corporate Conference',
        date: new Date('2026-10-22'),
        startTime: '08:30',
        endTime: '18:00',
        location: 'Grand Convention Center, Hall B',
        requiredForce: 12,
        assignedForceCount: 2,
        status: 'Upcoming',
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        createdBy: manager1._id,
      },
      {
        name: 'Metropolitan City Marathon 2026',
        description: 'Annual 42km marathon with over 5,000 participating athletes across the city routes.',
        category: 'Sports Tournament',
        date: new Date('2026-11-05'),
        startTime: '05:30',
        endTime: '13:00',
        location: 'City Central Park & Main Boulevard',
        requiredForce: 35,
        assignedForceCount: 0,
        status: 'Upcoming',
        bannerUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80',
        createdBy: manager2._id,
      },
      {
        name: 'National E-Sports Championship',
        description: 'Pro gaming tournament featuring live arena battles, commentary stream, and VIP booths.',
        category: 'Exhibition',
        date: new Date('2026-09-28'),
        startTime: '10:00',
        endTime: '21:00',
        location: 'Cyber Arena Dome 4',
        requiredForce: 8,
        assignedForceCount: 3,
        status: 'Active',
        bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
        createdBy: manager2._id,
      },
    ];

    const createdEvents = await Event.create(eventsData);

    console.log('Seeding initial assignments & notifications...');

    // 5. Create Assignments
    const assignmentsData = [
      {
        eventId: createdEvents[0]._id, // Cultural Fest
        forceMemberId: createdStaff[0]._id, // John Miller
        assignedBy: manager1._id,
        roleInEvent: 'Head Security Officer',
        status: 'Confirmed',
        note: 'Supervise main stage perimeter security',
      },
      {
        eventId: createdEvents[0]._id, // Cultural Fest
        forceMemberId: createdStaff[1]._id, // Alex Rivera
        assignedBy: manager1._id,
        roleInEvent: 'Gate 2 Crowd Controller',
        status: 'Confirmed',
        note: 'Manage ticket scanning queues at North Gate',
      },
      {
        eventId: createdEvents[0]._id, // Cultural Fest
        forceMemberId: createdStaff[3]._id, // Mark Taylor
        assignedBy: manager1._id,
        roleInEvent: 'Equipment Coordinator',
        status: 'Assigned',
        note: 'Manage sound and lighting transport',
      },
      {
        eventId: createdEvents[1]._id, // Tech Summit
        forceMemberId: createdStaff[1]._id, // Alex Rivera
        assignedBy: manager1._id,
        roleInEvent: 'VIP Escort Lead',
        status: 'Confirmed',
      },
      {
        eventId: createdEvents[3]._id, // E-Sports
        forceMemberId: createdStaff[4]._id, // David Chen
        assignedBy: manager2._id,
        roleInEvent: 'Network & Arena Tech',
        status: 'Confirmed',
      },
    ];

    await Assignment.create(assignmentsData);

    // 6. Notifications
    await Notification.create([
      {
        recipient: createdStaff[0]._id,
        sender: manager1._id,
        title: 'Assigned to College Cultural Festival',
        message: 'You have been assigned as Head Security Officer for College Cultural Festival on Oct 15, 2026.',
        type: 'Assignment',
        link: `/events/${createdEvents[0]._id}`,
      },
      {
        recipient: createdStaff[1]._id,
        sender: manager1._id,
        title: 'Assigned to College Cultural Festival',
        message: 'You have been assigned as Gate 2 Crowd Controller for College Cultural Festival on Oct 15, 2026.',
        type: 'Assignment',
        link: `/events/${createdEvents[0]._id}`,
      },
    ]);

    console.log('\n======================================================');
    console.log('Database successfully seeded with demo credentials!');
    console.log('------------------------------------------------------');
    console.log('ADMIN LOGIN:');
    console.log('  Email:    admin@eventforce.com');
    console.log('  Password: password123');
    console.log('------------------------------------------------------');
    console.log('EVENT MANAGER LOGIN:');
    console.log('  Email:    manager@eventforce.com');
    console.log('  Password: password123');
    console.log('------------------------------------------------------');
    console.log('STAFF / FORCE MEMBER LOGIN:');
    console.log('  Email:    john.security@eventforce.com');
    console.log('  Password: password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
