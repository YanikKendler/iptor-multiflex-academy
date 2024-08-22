package boundary;

import dtos.UserDTO;
import dtos.UserLoginDTO;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Tag;
import model.User;
import repository.UserRepository;
import repository.VideoRepository;

import java.util.List;

@Path("user")
public class UserResource {
    @Inject
    UserRepository repository;
    @Inject
    UserRepository userRepository;
    @Inject
    VideoRepository videoRepository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createUser(UserDTO user){
        Long userId;
        try{
            userId = repository.create(user);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok(userId).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("login")
    public Response login(UserDTO user){
        Long user1;
        try{
            user1 = repository.login(user);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok(user1).build();
    }

    @POST
    @Path("isloggedin")
    public Response isLoggedIn(UserLoginDTO user){
        try{
            return Response.ok(repository.isLoggedIn(user)).build();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
    }

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

    @PUT
    @Path("{userId}/togglesavedcontent/{contentId}")
    public Response toggleSavedVideo(@PathParam("userId") Long userId, @PathParam("contentId") Long contentId) {
        try {
            repository.toggleSavedVideo(userId, contentId);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Path("{userId}/isvideosaved/{videoId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response isVideoSaved(@PathParam("userId") Long userId, @PathParam("videoId") Long videoId) {
        try {
            return Response.ok(repository.isVideoSaved(videoId, userId)).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Path("{userId}/usercontent")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserContent(@PathParam("userId") Long userId) {
        try {
            return Response.ok(repository.getUserContent(userId)).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{userId}/contentforuser")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getContentForUser(@PathParam("userId") Long userId, JsonObject filterTags) {
        System.out.println(filterTags);
        try {
            return Response.ok(repository.getContentForUser(userId)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }
}
