import { db } from './firebase';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { Project } from '@/types/project';

const COLLECTION_NAME = 'projects';

/**
 * Push all projects to Firestore using batch operations
 * @param projects Array of projects to upload
 * @returns Success message or throws error
 */
export async function pushProjectsToFirestore(projects: Project[]): Promise<string> {
  try {
    const batch = writeBatch(db);
    
    // Get existing documents to delete them
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    querySnapshot.docs.forEach((document) => {
      batch.delete(document.ref);
    });

    // Add new data to the batch
    projects.forEach((project) => {
      const projectData = {
        ...project,
        createdAt: project.createdAt instanceof Date ? project.createdAt.toISOString() : project.createdAt,
        updatedAt: project.updatedAt instanceof Date ? project.updatedAt.toISOString() : project.updatedAt,
      };
      const docRef = doc(db, COLLECTION_NAME, project.id);
      batch.set(docRef, projectData);
    });
    
    // Commit all operations in a single batch
    await batch.commit();
    return `Successfully uploaded ${projects.length} project(s) to cloud`;
  } catch (error) {
    console.error('Error pushing to Firestore:', error);
    throw new Error('Failed to upload data to cloud. Please check your internet connection and try again.');
  }
}

/**
 * Pull all projects from Firestore
 * @returns Array of projects
 */
export async function pullProjectsFromFirestore(): Promise<Project[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const projects: Project[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      } as Project;
    });
    
    return projects;
  } catch (error) {
    console.error('Error pulling from Firestore:', error);
    throw new Error('Failed to download data from cloud. Please check your internet connection and try again.');
  }
}
