const serviceService = require("../services/service/service.service");
const serviceTypeService = require("../services/service/serviceType.service");


class ServiceController {

    //[GET] /services/
    async show(req, res, next) {
        const allServiceTypes = await serviceTypeService.findAll();
        if (req.user) {
            if (!req.user.ServiceCart) {
                req.user.ServiceCart = [];
            }
            console.log(req.user.ServiceCart);
        }
        res.render("services/services", {
            allServices: allServiceTypes,
            isAuth: req.user,
            cart: req.user ? req.user.ServiceCart : null,
        });

    }

    //[GET] /services/:id_service
    async ServiceDetail(req, res, next) {

        const services = await serviceService.findByTypeId(req.params.id_service);
        console.log(services);
        res.render("services/service-details", {
            services: services,
            isAuth: req.user
        });
    }

    //[POST] /services/add-to-cart
    async addServiceToCart(req, res, next) {
        if (req.user) {
            if (!req.user.ServiceCart) {
                req.user.ServiceCart = [];
            }
            var ServiceCart = req.user.ServiceCart;
            var tempCart = [];
            const idservices = req.body.id_service;
            const nameservices = req.body.name_service;
            const priceservices = req.body.price_service;
            const order_amounts = req.body.order_amount;

            if (Array.isArray(idservices)) {
                for (let i = 0; i < idservices.length; i++) {
                    tempCart.push({
                        idService: idservices[i],
                        nameService: nameservices[i],
                        priceService: priceservices[i],
                        orderAmount: order_amounts[i],
                        orderDate: new Date(),
                    })
                }
            } else {
                tempCart.push({
                    idService: idservices,
                    nameService: nameservices,
                    priceService: priceservices,
                    orderAmount: order_amounts,
                    orderDate: new Date(),
                })
            }
            //find existed services
            for (let i = 0; i < tempCart.length; i++) {
                const index = ServiceCart.findIndex((o) => o.idService == tempCart[i].idService);

                if (index >= 0) {
                    //update quantity
                    if (parseInt(tempCart[i].orderAmount) > 0) {
                        ServiceCart[index].orderAmount = tempCart[i].orderAmount;
                    }

                } else {
                    {
                        ServiceCart.push(tempCart[i]);
                    }

                }
            }

            console.log(req.user.cart);
            //return to services
            res.redirect("/services");
        }
    }

    //[GET] /services/clear-cart
    async clearCart(req, res, next) {
        if (req.user) {
            if (req.user.ServiceCart) {
                console.log(req.user.ServiceCart);
                req.user.ServiceCart = null;

                console.log("Deleted received!");
                console.log(req.user.ServiceCart);
                console.log(req.user);
                res.redirect('/services');

            }
        }
    }

    //[POST] /services/update-cart/:serviceID/:qty
    async updateIncart(req, res, next) {
        if (req.user) {
            const serviceID = req.params.serviceID;
            const qty = req.params.qty;
            if (req.user.ServiceCart) {
                const index = req.user.ServiceCart.findIndex((o) => o.idService == serviceID);
                if (index >= 0) {
                    req.user.ServiceCart[index].orderAmount = qty;
                    res.send("Success update " + String(serviceID) + "-" + String(qty));

                    return;
                }
            }

        }
    }


}
module.exports = new ServiceController;