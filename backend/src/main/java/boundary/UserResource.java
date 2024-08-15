package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Employee;
import repository.EmployeeRepository;
import repository.UserRepository;

import java.util.List;

@Path("user")
public class UserResource {
    @Inject
    UserRepository repository;

    @PUT
    @Path("{userId}/togglesavedvideo/{videoId}")
    public Response toggleSavedVideo(@PathParam("userId") Long userId, @PathParam("videoId") Long videoId) {
        try {
            repository.toggleSavedVideo(userId, videoId);
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
            return Response.ok(repository.isVideoSaved(userId, videoId)).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Path("{userId}/suggestedvideos")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSuggestedVideos(@PathParam("userId") Long userId) {
        try {
            return Response.ok(repository.getSuggestedVideos(userId)).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }
}
