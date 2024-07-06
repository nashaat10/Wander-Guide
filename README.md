Wander Guide<a name="TOP"></a>
===================

# Description #
Wander Guide is a tour booking website that allows users to book tours and manage their bookings. It is built using Node.js, Express, MongoDB


# Features #

1. protected routes, authentication, authorization, security, payments, and more.
2. MVC architecture
3. RESTful API
4. CRUD operations
5. Advanced authentication and security
6. Payments with Stripe
7. Mapbox integration
8. Email sending with Mailtrap and Sendinblue
9. Advanced error handling
10. File uploading
11. Advanced MongoDB
12. Geospatial data
13. Advanced mongoose features
14. Image processing with sharp
15. And much more!
# APIs # 
Auth:
~~~
/api/v1/users/signup [POST]
/api/v1/users/login [POST]
/api/v1/users/forgotPassword [POST]
/api/v1/users/resetPassword/:token [PATCH]
/api/v1/users/updateMyPassword [PATCH]
~~~

Users:
~~~
/api/v1/users [GET] (admin only)
/api/v1/users/:id [GET] (admin only)
/api/v1/users [POST] (admin only)
/api/v1/users/:id [PATCH] (admin only)
/api/v1/users/:id [DELETE] (admin only)
/api/v1/users/me [GET]
/api/v1/users/updateMe [PATCH]
/api/v1/users/deleteMe [DELETE]
~~~
Tours:
~~~
/api/v1/tours [get]
/api/v1/tours/top-5-cheap [GET]
/api/v1/tours/monthly-plan/:year [GET]
/api/v1/tours/tour-stats [GET]
/api/v1/tours/:id [GET]
/api/v1/tours [POST]
/api/v1/tours/:id [PATCH]
/api/v1/tours/:id [DELETE]
/api/v1/tours/tour-within/400/center/:lat, -long/unit/:unit [GET]
/api/v1/tours/distances/:lat, -long/unit/:unit [GET]
~~~
Reviews:
~~~
/api/v1/reviews [GET]
/api/v1/reviews/:id [GET]
/api/v1/tours/:tourId/reviews [POST]
/api/v1/reviews/:tourId [PATCH]
/api/v1/reviews/:tourId [DELETE]
/api/v1/tours/:tourId/reviews [GET]
~~~
Bookings
~~~
/api/v1/bookings/checkout-session/:tourId [GET]
/api/v1/bookings [GET] (admin and lead-guide only)
/api/v1/bookings [POST] (admin and lead-guide only)
/api/v1/bookings/:id [GET] (admin and lead-guide only)
/api/v1/bookings/:id [PATCH] (admin and lead-guide only)
/api/v1/bookings/:id [DELETE] (admin and lead-guide only)



~~~


