package boundary;

import jakarta.inject.Inject;
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

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createTag(@PathParam("videoId")Long vid, ViewProgress vp){
        try {
            repository.create(vid, vp);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("videoId")Long vid){
        List<Tag> tags;
        try{
            tags = repository.getAll();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(tags).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/latest")
    public Response getLatest(@PathParam("videoId")Long vid, @PathParam("userId")Long uid){
        ViewProgress vp;
        try{
            vp = repository.getLatest(vid, uid);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(vp).build();
    }


    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteTag(@PathParam("id") Long id){
        try{
            repository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTag(@PathParam("id") Long id, ViewProgress vp){
        try{
            repository.update(vp);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
