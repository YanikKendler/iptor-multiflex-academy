package boundary;

import dtos.*;
import enums.UserRoleEnum;
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

import java.util.List;

@Path("user")
public class UserResource {
    @Inject
    UserRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createUser(UserDTO user){
        try{
            return Response.ok(repository.create(user)).build();
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("login")
    public Response login(UserDTO userDTO){
        try{
            User user = repository.login(userDTO);
            return Response.ok(user).build();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
    }

    @POST
    @Path("isloggedin")
    public Response isLoggedIn(UserLoginDTO user){
        try{
            User isLoggedIn = repository.isLoggedIn(user);
            return Response.ok(isLoggedIn).build();
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
    @Path("customers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCustomers(){
        List<UserTreeDTO> users;
        try{
            users = repository.getCustomers();
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

    @DELETE
    @Path("{userId: [0-9]+}")
    public Response deleteUser(@PathParam("userId") Long userId, @QueryParam("adminId") Long adminId){
        try{
            repository.delete(userId, adminId);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{userId: [0-9]+}/role")
    public Response updateRole(@PathParam("userId") Long userId, @QueryParam("adminId") Long adminId, UserRoleEnum newRole){
        if(newRole == UserRoleEnum.ADMIN)
            Response.status(Response.Status.METHOD_NOT_ALLOWED).build();

        try{
            repository.updateRole(userId, adminId, newRole);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
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

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{userId}/contentforuser")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getContentForUser(@PathParam("userId") Long userId, FilterDTO filterTags) {
        try {
            return Response.ok(repository.getContentForUser(userId, filterTags.tags())).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{userId}/getusers")
    public Response manageUsers(@PathParam("userId") Long userId) {
        try {
            UserTreeDTO userTree = repository.getFullUserTree(userId);
            return Response.ok(userTree).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{userId}/assignedcontent")
    public Response getAssignedContent(@PathParam("userId") Long userId) {
        try {
            return Response.ok(repository.getUserAssignedContent(userId)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @POST
    @Path("{userId}/assigncontent/{contentId}")
    public Response assignContent(@PathParam("userId") Long userId, @QueryParam("assignTo") Long assignToUserId, @PathParam("contentId") Long contentId) {
        try {
            UserAssignedContentDTO result = repository.assignContent(userId, assignToUserId, contentId);
            return Response.ok(result).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @DELETE
    @Path("{userId}/unassigncontent/{contentId}")
    public Response unassignContent(@PathParam("userId") Long userId, @PathParam("contentId") Long contentId) {
        try {
            repository.unassignContent(userId, contentId);
            return Response.ok().build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @PUT
    @Path("{userId}/finishassignedcontent/{contentId}")
    public Response finishAssignedContent(@PathParam("userId") Long userId, @PathParam("contentId") Long contentId) {
        try {
            repository.finishAssignedContent(userId, contentId);
            return Response.ok().build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Path("{userId}/isallowed/{contentId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response isAllowed(@PathParam("userId") Long userId, @PathParam("contentId") Long contentId) {
        try {
            return Response.ok(repository.isAllowed(userId, contentId)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Path("{userId}/statistics")
    public Response getStatistics(@PathParam("userId") Long userId) {
        try {
            return Response.ok(repository.getStatistics(userId)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }
}
