const Cart = require("../models/cart.model");

const RoomTypeSerivce = require("../services/room/roomType.service");
const { generateBookingTable } = require('../utils/')
class RoomController {
    //[GET] /rooms/
    async show(req, res, next) {
        const allRooms = await RoomTypeSerivce.find();
        console.log(allRooms);

        console.log(req.session.cart);
        if (!req.session.cart) {
            req.session.cart = { rooms: [], services: [] };
        }
        var cart = req.session.cart;
        cart.length = cart.rooms.length;

        res.render('rooms/rooms', {
            allRooms: allRooms,
            cart: cart,
        });
    }

    //[GET] /rooms/room-details
    async getRoomDetail(req, res, next) {
        const roomType = await RoomTypeSerivce.findById(req.params.id_room);



        // mock data will be changed to load data from database after
        const rooms = [
                { _id: 1, roomNumber: 400, status: 'available' },
                { _id: 2, roomNumber: 401 },
                { _id: 3, roomNumber: 402 },
                { _id: 4, roomNumber: 403, status: 'available' },
                { _id: 5, roomNumber: 404 },
                { _id: 6, roomNumber: 405 },
                { _id: 7, roomNumber: 406 },
                { _id: 8, roomNumber: 407 },
            ]
            //combine with cart to set up status
        if (!req.session.cart) {
            req.session.cart = { rooms: [], services: [] };
        }
        var cart = req.session.cart;
        console.log(cart.rooms);
        for (let i = 0; i < cart.rooms.length; i++) {
            const currentRoomCart = cart.rooms[i];
            //if exist
            if (currentRoomCart) {
                for (let j = 0; j < rooms.length; j++) {
                    if (rooms[j].status == 'available') {
                        console.log(rooms[j].roomNumber);
                        console.log(currentRoomCart.listRoom);
                        const index = currentRoomCart.listRoom.findIndex((o) => String(o.roomid) == String(rooms[j].roomNumber));
                        if (index >= 0) {
                            rooms[j].status = 'unvailable';
                        }
                    }
                }
            }
        }
        var msg = "";
        if (cart.rooms.length == 0) {
            msg = "Please book your room";
        }

        const table = generateBookingTable(rooms)

        res.render('rooms/room-details', {
            roomType: roomType,
            table: table,
            cart: req.session.cart,
            message: msg,
        });
    }

    async addRoomCart(req, res, next) {
        const idRooms = req.body.roomID;
        const peoples = req.body.people;
        const checkins = req.body.checkin;
        const checkouts = req.body.checkout;

        console.log(req.body.people);
        console.log(req.body.roomType);
        console.log(req.body.roomID);
        const room = {
            RoomType: req.body.roomType,
            RoomImage: req.body.roomImage,
            RoomPrice: req.body.roomPrice,
            listRoom: [],
        };

        if (Array.isArray(idRooms)) {
            for (let i = 0; i < idRooms.length; i++) {
                room.listRoom.push({
                    roomid: idRooms[i],
                    people: peoples[i],
                    checkin: checkins[i],
                    checkout: checkouts[i],
                });
            }
        } else {
            room.listRoom.push({
                roomid: idRooms,
                people: peoples,
                checkin: checkins,
                checkout: checkouts,
            });
        }

        var cart = req.session.cart;
        const index = cart.rooms.findIndex((o) => o.RoomType == room.RoomType);
        if (index >= 0) {
            for (let i = 0; i < room.listRoom.length; i++) {
                cart.rooms[i].listRoom.push(room.listRoom[i]);
            }
        } else {
            cart.rooms.push(room);
        }



        // {"rooms":[{"RoomType":"Phòng thường","RoomImage":"https://firebasestorage.googleapis.com/v0/b/hmsapp-91b1a.appspot.com/o/Noi-that-khach-san-dep-3.png?alt=media&token=f0b108b4-1f9d-482a-b32a-1b87e1a46cf2","listRoom":[{"roomid":"403","people":"1","checkin":"2022-01-01","checkout":"2022-01-02"},
        //{"roomid":"400","people":"1","checkin":"2022-01-20","checkout":"2022-01-03"}]}],"services":[],"length":0}
        //push to cart
        res.redirect("/rooms");


    }
}
module.exports = new RoomController;