package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Customer;
import model.User;
import repository.UserRepository;

import java.util.List;

public class UserResource {
    @Inject
    UserRepository repository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        List<User> users;
        try{
            users = repository.getAll();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(users).build();
    }

    @GET
    @Path("{userId: [0-9]+}")
    public Response getUser(@PathParam("userId") Long userId){
        User user;
        try{
            user = repository.getById(userId);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(user).build();
    }
}
