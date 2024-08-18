package boundary;

import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Tag;
import model.ViewProgress;
import repository.TagRepository;
import repository.ViewProgressRepository;

import java.util.List;

@Path("/video/{videoId: [0-9]+}/progress/{userId: [0-9]+}")
public class ViewProgressResource {
    @Inject
    ViewProgressRepository repository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProgress(@PathParam("videoId") Long videoId, @PathParam("userId") Long userId){
        ViewProgress vp;
        try{
            vp = repository.getLatest(videoId, userId);
        }catch (Exception ex){
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(vp).build();
    }

    @DELETE
    public Response deleteProgress(@PathParam("videoId") Long videoId, @PathParam("userId") Long userId){
        try{
            repository.delete(videoId, userId);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateViewProgress(@PathParam("videoId") Long videoId, @PathParam("userId") Long userId, JsonObject data){
        try{
            repository.update(videoId, userId, data.getInt("durationSeconds"));
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("/ignore")
    public Response ignoreProgress(@PathParam("videoId") Long videoId, @PathParam("userId") Long userId){
        try{
            repository.ignore(videoId, userId);
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
