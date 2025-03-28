import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import dayjs from "dayjs"

const MessageCard = ({key, message, onMessageDelete}: any) => {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.post(
              `/api/delete-message?id=${message._id}`
            );
            toast({
              title: response.data.message,
            });
            onMessageDelete(message._id);
      
          } catch (error: any) {
            console.log("ERROR WHILE DELETING MESSAGE: ", error)
            toast({
              title: 'Error',
              description: error.response.data.message || "Error while deleting message",
              variant: 'destructive',
            });
          } 
    };

  return (
    <Card className="card-bordered">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="text-sm">
        {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
      </div>
    </CardHeader>
    <CardContent></CardContent>
  </Card>
  )
}

export default MessageCard
