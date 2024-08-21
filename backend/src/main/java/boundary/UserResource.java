package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
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
    @Path("{userId}/videos")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserVideos(@PathParam("userId") Long userId) {
        try {
            return Response.ok(repository.getUserVideos(userId)).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Path("{userId}/learningpaths")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserLearningpaths(@PathParam("userId") Long userId) {
        try {
            return Response.ok(repository.getUserLearningpaths(userId)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Path("{userId}/contentforuser")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getContentForUser(@PathParam("userId") Long userId) {
        try {
            return Response.ok(repository.getContentForUser(userId)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }
}
